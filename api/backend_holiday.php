<?php

/** 
 * holiday.php
 * error code from 104X 
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

class Holiday {

    private $common;
    private $db;
    private $log;
    private $classTable = 'holiday';
    private $classAction = 'holiday';

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
                case 'getHolidayList':
                    $this->handleHolidays($data);
                    break;

                case 'deleteHoliday':
                    $this->handleDeleteHoliday($data);
                    break;

                case 'insertHoliday':
                    $result = $this->handleInsertHoliday($data);
                    break;

                case 'editHolidayTitle':
                    $this->handleEditHoliday($data);
                    break;
            }
        }
    }

    private function handleHolidays($data) {
        $search = '';
        if (isset($data['search']) && $data['search'] != '') {
            $search = "WHERE title LIKE '%".$data['search']."%'";
        }
        $sql = "SELECT *
                , DATE_FORMAT(date, '%a %d %M %Y') AS format_date
            FROM $this->classTable
            $search
            ORDER BY date ASC";

        $this->db->select(false, false, $sql);

        if ($this->db->numRows > 0) {
            $data = array();
            while ($result = $this->db->getRow(true)) {
                array_push($data, $result);
            }
            echo json_encode(array('status' => 200, 'result' => $data));
        } else {
            echo json_encode(array('status' => 1040));
        }
    }

    private function handleDeleteHoliday($data) {
        $this->db->setTable($this->classTable);
        $this->db->delete('id = :id', false, array('id' => (int)$data['id']));

        if ($this->db->rowsAffected > 0) {
            // update json file
            $this->common->updateJsonHoliday($this->db);
            echo json_encode(array('status' => 200));
            $isSuccess = 1;
        } else {
            echo json_encode(array('status' => 1041));
            $isSuccess = 0;
        }
        $this->log->writeAdminLog($this->classAction, $data['action'], '#'.$data['id'].' '.$data['title'], $isSuccess, $data['aid']);
        exit;
    }

    private function handleInsertHoliday($data) {

        $params = array(
            'title' => $data['title'],
            'date' => $data['date'],
            'tenant' => 'AU',
        );
        $this->db->insert($this->classTable, $params);

        if ($this->db->lastInsertId) {
            // update json file
            $this->common->updateJsonHoliday($this->db);
            echo json_encode(array('status' => 200));
            $isSuccess = 1;
        } else {
            echo json_encode(array('status' => 1042));
            $isSuccess = 0;
        }

        $this->log->writeAdminLog($this->classAction, $data['action'], '#'.$this->db->lastInsertId.' '.$data['title'].' '.$data['date'], $isSuccess, $data['aid']);
        exit;
    }

    private function handleEditHoliday($data) {

        $this->db->setTable($this->classTable);
        $params = array(
            'title' => $data['title'],
            'date' => $data['date']
        );
        $updateParams = $params;
        $updateParams['id'] = $data['id'];
        $this->db->update($params, 'id = :id', false, $updateParams);

        if ($this->db->rowsAffected > 0) {
            // update json file
            $this->common->updateJsonHoliday($this->db);
            echo json_encode(array('status' => 200));
            $isSuccess = 1;
        } else {
            echo json_encode(array('status' => 1043));
            $isSuccess = 0;
        }

        $this->log->writeAdminLog($this->classAction, $data['action'], '#'.$data['id'].' '.$data['title'], $isSuccess, $data['aid']);
        exit;
    }

}

$holiday = new Holiday();

?>