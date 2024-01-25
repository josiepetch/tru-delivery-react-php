<?php

/** 
 * delivery.php
 * error code from 201X
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

// no need this because database had stored in Australia/Melbourn timezone
// $time_zone = new DateTimeZone('Australia/Melbourne');
// date_default_timezone_set('Australia/Melbourne');

use \Firebase\JWT\JWT;

class Delivery {

    private $common;
    private $db;
    private $log;

    public function __construct() {
        $this->common = new Common();
        $this->db = new Database();
        $this->log = new Log();

        $this->handleRequest();
    }

    public function handleRequest() {
        $data = json_decode(file_get_contents('php://input'), true);

        if ($data) {
            $action = isset($data['action']) ? $data['action'] : '';
            switch ($action) {
                case 'insertbooking':
                    $this->handleInsertBooking($data);
                    break;

                case 'mybooking':
                    $this->handleGetBookingList($data);
                    break;

                case 'getbooking':
                    $this->handleGetBooking($data);
                    break;

                case 'updatebooking':
                    $this->handleUpdateBooking($data);
                    break;

                case 'deletebooking':
                    $this->handleDeleteBooking($data);
                    break;
            }
        } else {
            echo json_encode(array('status' => 2010));
            exit;
        }
    }    

    private function handleInsertBooking($data) {
        $selectedDate = date('Y-m-d H:i', strtotime($data['selectedDate']));

        $params = array(
            'supplier_id' => $data['sid'],
            'booktime' => $selectedDate,
            'duration' => $data['item'] > 10 ? 45 : 30,
            'location' => 'V03',
            'po_number' => $data['ponumber'],
            'type' => $data['typenum'] ? $data['typenum'] : 1,
            'item' => $data['item'],
            'note' => $data['note'],
            'status' => 1
        );

        $this->db->insert('delivery', $params);
        if ($this->db->lastInsertId) {
            echo json_encode(array('status' => 200));
            $isSuccess = 1;
        } else {
            echo json_encode(array('status' => 2011));
            $isSuccess = 0;
        }
        $this->log->writeSupplierLog('delivery', $data['action'], '#'.$this->db->lastInsertId, $isSuccess, $data['sid']);
        exit;
    }

    private function handleGetBookingList($data) {

        $sql = "SELECT *
                , CASE type WHEN 1 THEN 'Pallets' WHEN 2 THEN 'Cartons' END AS type_title
                , DATE_FORMAT(booktime, '%a %D %M %Y %l:%i %p') AS format_booktime
            FROM delivery
            WHERE supplier_id = :sid AND booktime >= NOW()
            ORDER BY booktime ASC";
        $this->db->select(false, false, $sql, array('sid' => $data['sid']));

        if ($this->db->numRows > 0) {
            $data = array();
            while ($result = $this->db->getRow(true)) {
                array_push($data, $result);
            }
            echo json_encode(array('status' => 200, 'result' => $data));
        } else {
            echo json_encode(array('status' => 2012));
        }
        exit;
    }

    private function handleGetBooking($data) {
        $sql = "SELECT *
                , CASE type WHEN 1 THEN 'Pallets' WHEN 2 THEN 'Cartons' END AS type_title
                , DATE_FORMAT(booktime, '%a %D %M %Y %l:%i %p') AS format_booktime
            FROM delivery
            WHERE id = :id";
        $result = $this->db->selectFetchOne(false, false, $sql, array('id' => $data['id']));

        if ($result) {
            echo json_encode(array('status' => 200, 'result' => $result));
            exit;
        }

        echo json_encode(array('status' => 2013));
        exit;
    }

    private function handleUpdateBooking($data) {
        $this->db->setTable('delivery');
        $params = array(
            'supplier_id' => $data['sid'],
            'booktime' => $data['booktime'],
            'duration' => $data['item'] < 10 ? 30 : 45,
            'location' => 'V03',
            'po_number' => $data['po_number'],
            'type' => $data['type'],
            'item' => $data['item'],
            'note' => $data['note'],
            'date_updated' => date('Y-m-d H:i:s'),
            'status' => 1
        );
        
        $updateParams = $params;
        $updateParams['id'] = $data['id'];

        $this->db->update($params, 'id = :id', false, $updateParams);

        if ($this->db->rowsAffected > 0) {
            echo json_encode(array('status' => 200));
            $isSuccess = 1;
        } else {
            echo json_encode(array('status' => 2014));
            $isSuccess = 0;
        }
        $this->log->writeSupplierLog('delivery', $data['action'], '#'.$data['id'], $isSuccess, $data['sid']);
        exit;
    }

    public function handleDeleteBooking($data) {
        $this->db->setTable('delivery');
        $this->db->delete('id = :id', false, array('id' => (int)$data['id']));

        if ($this->db->rowsAffected > 0) {
            echo json_encode(array('status' => 200));
            $isSuccess = 1;
        } else {
            echo json_encode(array('status' => 2015));
            $isSuccess = 0;
        }
        $this->log->writeSupplierLog('delivery', $data['action'], '#'.$data['id'], $isSuccess, $data['sid']);
        exit;
    }

}

$delivery = new Delivery();

?>
