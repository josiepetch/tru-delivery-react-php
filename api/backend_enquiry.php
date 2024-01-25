<?php

/** 
 * enquiry.php
 * error code from 103X 
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

class Enquiry {

    private $common;
    private $db;
    private $log;
    private $classAction = 'enquiry';

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
                case 'getEnquiryList':
                    $this->handleEnquiryList($data);
                    break;

                case 'getEnquiryDetail':
                    $this->handleEnquiryDetails($data);
                    break;

                case 'updateEnquiryDetail':
                    $this->handleUpdateEnquiryDetails($data);
                    break;

                case 'searchEnquiry':
                    $this->handleSearchEnquiries($data);
                    break;

                case 'searchStatusEnquiry':
                    $this->handleSearchStatusEnquiries($data);
                    break;
            }
        }
    }

    private function handleEnquiryList($data) {
        $sql = "SELECT e.supplier_id, s.name AS supplier_name, e.status, d.*
                -- , DATE_FORMAT(d.date_added, '%d-%m-%Y %l:%i %p') AS enquiry_date
                ,   CASE 
                    WHEN DATE_FORMAT(d.date_added, '%Y-%m-%d') = CURDATE() THEN DATE_FORMAT(d.date_added, '%l:%i %p')
                    WHEN DATE_FORMAT(d.date_added, '%Y-%m-%d') = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 'Yesterday'
                    ELSE DATE_FORMAT(d.date_added, '%b %d')
                    END AS enquiry_date
                , a.username
            FROM enquiry_detail d 
                INNER JOIN enquiry e ON d.enquiry_id = e.id
                LEFT JOIN admin a ON d.admin_id = a.id
                LEFT JOIN suppliers s ON s.id = e.supplier_id
            GROUP BY e.id
            ORDER BY e.status ASC, d.id DESC";
        $this->db->select(false, false, $sql);

        if ($this->db->numRows > 0) {
            $data = array();
            while ($result = $this->db->getRow(true)) {
                array_push($data, $result);
            }
            echo json_encode(array('status' => 200, 'result' => $data));
        } else {
            echo json_encode(array('status' => 1030));
        }
        exit;
    }

    private function handleEnquiryDetails($data) {
        $sql = "SELECT e.supplier_id, s.name, d.*
                , DATE_FORMAT(d.date_added, '%d-%m-%Y %l:%i %p') AS enquiry_date
                , a.username
            FROM enquiry_detail d 
                INNER JOIN enquiry e ON d.enquiry_id = e.id
                LEFT JOIN admin a ON d.admin_id = a.id
                LEFT JOIN suppliers s ON s.id = e.supplier_id
            WHERE d.enquiry_id = :id";
        // $sql = "SELECT d.*
        //         , DATE_FORMAT(d.date_added, '%a %D %M %Y %l:%i %p') AS format_booktime
        //     FROM enquiry e
        //         INNER JOIN enquiry_detail d ON e.id = d.enquiry_id 
        //     WHERE e.id = :id";
        $this->db->select(false, false, $sql, array('id' => $data['id']));

        if ($this->db->numRows > 0) {
            $data = array();
            while ($result = $this->db->getRow(true)) {
                array_push($data, $result);
            }
            echo json_encode(array('status' => 200, 'result' => $data));
        } else {
            echo json_encode(array('status' => 1031));
        }
    }

    private function handleUpdateEnquiryDetails($data) {
        $params = array(
            'enquiry_id' => $data['id'],
            'enquiry' => $data['enquiry'],
            'admin_id' => $data['aid'],
        );
        $this->db->insert('enquiry_detail', $params);

        if ($this->db->lastInsertId) {
            $insert_id = $this->db->lastInsertId;

            $this->db->setTable('enquiry');
            $params = array(
                'status' => 2
            );
            $updateParams = $params;
            $updateParams['id'] = $data['id'];
            $this->db->update($params, 'id = :id', false, $updateParams);

            echo json_encode(array('status' => 200));
            $isSuccess = 1;
        } else {
            echo json_encode(array('status' => 1032));
            $isSuccess = 0;
        }

        $this->log->writeAdminLog($this->classAction, $data['action'], '#'.$data['id'], $isSuccess, $data['aid']);
        exit;
    }

    private function handleSearchEnquiries($data) {
        $sql = "SELECT e.supplier_id, s.name AS supplier_name, e.status, d.*
                , DATE_FORMAT(d.date_added, '%d-%m-%Y %l:%i %p') AS enquiry_date
                , a.username
            FROM enquiry_detail d 
                INNER JOIN enquiry e ON d.enquiry_id = e.id
                LEFT JOIN admin a ON d.admin_id = a.id
                LEFT JOIN suppliers s ON s.id = e.supplier_id
            WHERE s.name LIKE :search OR d.enquiry LIKE :search OR a.username LIKE :search
            GROUP BY e.id
            ORDER BY e.status ASC, d.id DESC";

        $this->db->select(false, false, $sql, array('search' => "%".$data['search']."%"));

        if ($this->db->numRows > 0) {
            $data = array();
            while ($result = $this->db->getRow(true)) {
                array_push($data, $result);
            }
            echo json_encode(array('status' => 200, 'result' => $data));
        } else {
            echo json_encode(array('status' => 1033));
        }
    }

    private function handleSearchStatusEnquiries($data) {
        $sql = "SELECT e.supplier_id, s.name AS supplier_name, e.status, d.*
                , DATE_FORMAT(d.date_added, '%d-%m-%Y %l:%i %p') AS enquiry_date
                , a.username
            FROM enquiry_detail d 
                INNER JOIN enquiry e ON d.enquiry_id = e.id
                LEFT JOIN admin a ON d.admin_id = a.id
                LEFT JOIN suppliers s ON s.id = e.supplier_id
            WHERE e.status = :search
            GROUP BY e.id
            ORDER BY e.status ASC, d.id DESC";

        $this->db->select(false, false, $sql, array('search' => $data['search']));

        if ($this->db->numRows > 0) {
            $data = array();
            while ($result = $this->db->getRow(true)) {
                array_push($data, $result);
            }
            echo json_encode(array('status' => 200, 'result' => $data));
        } else {
            echo json_encode(array('status' => 1034));
        }
    }

}

$enquiry = new Enquiry();

?>