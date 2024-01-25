<?php

/** 
 * delivery.php
 * error code from 102X 
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

class Delivery {

    private $common;
    private $db;
    private $log;
    private $classAction = 'delivery';

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
                case 'getDeliveryList':
                    $this->handleDeliveryList($data);
                    break;
            }
        }
    }

    private function handleDeliveryList($data) {
        $sql = "SELECT d.*
                , CASE d.type WHEN 1 THEN 'Pallets' WHEN 2 THEN 'Cartons' END AS type_title
                , DATE_FORMAT(d.booktime, '%a %d %M %Y %l:%i %p') AS format_booktime
                , (SELECT s.name FROM suppliers s WHERE s.id = d.supplier_id) AS supplier_name
            FROM delivery d
            WHERE d.booktime > now()
            ORDER BY d.booktime ASC";
        $this->db->select(false, false, $sql);

        if ($this->db->numRows > 0) {
            $data = array();
            while ($result = $this->db->getRow(true)) {
                array_push($data, $result);
            }
            echo json_encode(array('status' => 200, 'result' => $data));
        } else {
            echo json_encode(array('status' => 1020));
        }
        exit;
    }

}

$delivery = new Delivery();

?>