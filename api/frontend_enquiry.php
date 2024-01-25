<?php

/** 
 * enquiry.php
 * error code from 202X
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
                case 'myenquiry':
                    $this->handleEnquiry($data);
                    break;

                case 'editmyenquiry':
                    $this->handleEditEnquiry($data);
                    break;

                case 'replyenquiry':
                    $this->handleReplyEnquiry($data);
                    break;

                case 'newenquiry':
                    $this->handleNewEnquiry($data);
                    break;

                case 'searchTerm':
                    $this->handleEnquiry($data);
                    break;
            }
        }
    }

    public function handleEnquiry($data) {
        $filter = '';
        if (isset($data['search'])) {
            $filter = "AND d.enquiry LIKE '%".$data['search']."%'";
        }
        $sql = "SELECT * 
            , CASE 
                WHEN DATE_FORMAT(d.date_added, '%Y-%m-%d') = CURDATE() THEN DATE_FORMAT(d.date_added, '%l:%i %p')
                WHEN DATE_FORMAT(d.date_added, '%Y-%m-%d') = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 'Yesterday'
                ELSE DATE_FORMAT(d.date_added, '%b %d')
                END AS format_booktime
            , CASE WHEN e.status = 1 THEN 'Open' WHEN e.status = 2 THEN 'New message' ELSE 'Ticket Closed' END AS text_status
                FROM enquiry e 
                    INNER JOIN enquiry_detail d on e.id = d.enquiry_id 
                WHERE e.supplier_id = :sid $filter
                GROUP BY d.enquiry_id
                ORDER BY d.date_added DESC";
        $this->db->select(false, false, $sql, array('sid'=>$data['sid']));

        if ($this->db->numRows > 0) {
            $result = array();
            while ($row = $this->db->getRow(true)) {
                array_push($result, $row);
            }
            echo json_encode(array('status' => 200, 'result' => $result));
        } else {
            echo json_encode(array('status' => 2020));
        }
        exit;
    }

    public function handleEditEnquiry($data) {
        $sql = "SELECT d.*
                , DATE_FORMAT(d.date_added, '%a %D %M %Y %l:%i %p') AS format_booktime
            FROM enquiry e
                INNER JOIN enquiry_detail d ON e.id = d.enquiry_id 
            WHERE e.id = :id";
        $this->db->select(false, false, $sql, array('id' => $data['id']));

        if ($this->db->numRows > 0) {
            $result = array();
            while ($row = $this->db->getRow(true)) {
                array_push($result, $row);
            }
            echo json_encode(array('status' => 200, 'result' => $result));
        } else {
            echo json_encode(array('status' => 2021));
        }
        exit;
    }

    private function handleReplyEnquiry($data) {
        $params = array(
            'enquiry_id' => $data['id'],
            'enquiry' => $data['enquiry'],
            'date_added' => date('Y-m-d H:i:s'),
            'admin_id' => 0
        );
        $this->db->insert('enquiry_detail', $params);

        // update status to 1
        $this->db->setTable('enquiry');
        $params = array(
            'status' => 1
        );
        $updateParams = $params;
        $updateParams['id'] = $data['id'];
        $this->db->update($params, 'id = :id', false, $updateParams);

        if ($this->db->lastInsertId) {
            echo json_encode(array('status' => 200));
            exit;
        }
        echo json_encode(array('status' => 2023));
        exit;
    }

    public function handleNewEnquiry($data) {
        $params = array(
            'tenant' => 'AU',
            'supplier_id' => $data['sid'],
            'date_added' => date('Y-m-d H:i:s'),
            'status' => 1
        );
        $this->db->insert('enquiry', $params);

        if ($this->db->lastInsertId) {
            $insert_id = $this->db->lastInsertId;
            $params = array(
                'enquiry_id' => $insert_id,
                'enquiry' => $data['enquiry'],
                'date_added' => date('Y-m-d H:i:s'),
                'admin_id' => 0
            );
            $this->db->insert('enquiry_detail', $params);
        
            if ($this->db->lastInsertId) {
                echo json_encode(array('status' => 200));
                exit;
            }
        }

        echo json_encode(array('status' => 2024));
        exit;
    }

}

$enquiry = new Enquiry();

?>