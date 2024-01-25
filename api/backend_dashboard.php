<?php

/** 
 * dashboard.php
 * error code from 106X
 **/

error_reporting(E_ALL);
ini_set('display_errors', '1');

include_once('common.php');
include_once('db.php');
include_once('write_log.php');

require '../vendor/autoload.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

$time_zone = new DateTimeZone('Australia/Melbourne');
date_default_timezone_set('Australia/Melbourne');

use \Firebase\JWT\JWT;

class Dashboard {

    private $common;
    private $db;
    private $log;

    public function __construct() {
        $this->common = new Common();
        $this->db = new Database();
        $this->log = new Log();

        $this->handleRequest();
    }

    private function handleRequest() {
        $data = json_decode(file_get_contents('php://input'), true);

        if ($data) {
            $action = isset($data['action']) ? $data['action'] : '';
            switch ($action) {
                case 'getDashboardList':
                    $this->handleList($data);
                    break;
            }
        }
    }

    private function handleList($data) {

        // Get the current date as a DateTime object
        $startDate = new DateTime();
        $endDate = new DateTime();

        // Move to tomorrow
        $startDate->modify('+1 day');

        // Calculate the number of days remaining until Friday (5 = Friday)
        $daysUntilFriday = (7 - $startDate->format('w') + 7) % 7;

        // Move to the upcoming Friday
        $endDate->modify('+' . $daysUntilFriday . ' day');

        // Format the dates and store them in variables
        $formattedStartDate = $startDate->format('Y-m-d');
        $formattedEndDate = $endDate->format('Y-m-d');

        $sql = "SELECT 
            (SELECT COUNT(id)
                FROM `delivery`
                WHERE `booktime` BETWEEN :start AND :end
            ) AS cnt_delivery,
            (SELECT COUNT(id) FROM `enquiry` WHERE status = 1) AS cnt_enquiry";
        $result = $this->db->selectFetchOne(false, false, $sql, array('start' => $formattedStartDate, 'end' => $formattedEndDate));

        if ($result) {
            echo json_encode(array('status' => 200, 'result' => $result));
        } else {
            echo json_encode(array('status' => 1060));
        }
        exit;
    }

}

$dashboard = new Dashboard();

?>