<?php

/** 
 * admin.php
 * error code from 101X 
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

class Admin {

    private $common;
    private $db;
    private $log;
    private $classAction = 'admin';

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
                case 'getAdminList':
                    $this->handleAdminList($data);
                    break;

                case 'getAdminDetail':
                    $this->handleAdminDetail($data);
                    break;

                case 'updateAdmin':
                    $this->handleUpdateAdmin($data);
                    break;

                case 'setActiveDeactive':
                    $this->handleActiveDeactive($data);
                    break;

                case 'deleteAdmin':
                    $this->handleDeleteAdmin($data);
                    break;

                case 'searchAdmin':
                    $this->handleSearchAdmin($data);
                    break;

                case 'insertAdmin':
                    $this->handleInsertAdmin($data);
                    break;
            }
        }
    }

    private function handleAdminList($data) {

        $sql = "SELECT *
            FROM admin
            ORDER BY username ASC";
        $this->db->select(false, false, $sql);

        if ($this->db->numRows > 0) {
            $data = array();
            while ($result = $this->db->getRow(true)) {
                array_push($data, $result);
            }
            echo json_encode(array('status' => 200, 'result' => $data));
        } else {
            echo json_encode(array('status' => 1010));
        }
        exit;
    }

    private function handleAdminDetail($data) {

        $sql = "SELECT *
            FROM admin
            WHERE id = :id
            LIMIT 1";
        $result = $this->db->selectFetchOne(false, false, $sql, array('id' => $data['id']));

        if ($result) {
            echo json_encode(array('status' => 200, 'result' => $result));
        } else {
            echo json_encode(array('status' => 1011));
        }
        exit;
    }

    private function handleUpdateAdmin($data) {

        $password = $this->common->generateRandomPassword($data['length']);
        $password_encrpt = $this->common->hashPassword($password);

        $this->db->setTable('admin');
        $params = array(
            'password' => $password_encrpt,
            'password_temp' => $password
        );
        $updateParams = $params;
        $updateParams['id'] = $data['id'];
        $this->db->update($params, 'id = :id', false, $updateParams);

        if ($this->db->rowsAffected > 0) {
            // send an email
            // code here

            echo json_encode(array('status' => 200));
            $isSuccess = 1;
        } else {
            echo json_encode(array('status' => 1012));
            $isSuccess = 0;
        }

        $this->log->writeAdminLog($this->classAction, $data['action'], '#'.$data['id'], $isSuccess, $data['aid']);
        exit;
    }

    private function handleActiveDeactive($data) {
        $this->db->setTable('admin');
        $params = array(
            'status' => $data['newStatus']
        );
        $updateParams = $params;
        $updateParams['id'] = $data['id'];
        $this->db->update($params, 'id = :id', false, $updateParams);

        if ($this->db->rowsAffected > 0) {
            echo json_encode(array('status' => 200));
            $isSuccess = 1;
        } else {
            echo json_encode(array('status' => 1013));
            $isSuccess = 0;
        }

        $this->log->writeAdminLog($this->classAction, $data['action'], '#'.$data['id'].' status '.$data['newStatus'], $isSuccess, $data['aid']);
        exit;
    }

    private function handleDeleteAdmin($data) {
        $this->db->setTable('admin');
        $this->db->delete('id = :id', false, array('id' => (int)$data['id']));

        if ($this->db->rowsAffected > 0) {
            echo json_encode(array('status' => 200));
            $isSuccess = 1;
        } else {
            echo json_encode(array('status' => 1014));
            $isSuccess = 0;
        }
        $this->log->writeAdminLog('admin', $data['action'], '#'.$data['id'].' '.$data['username'], $isSuccess, $data['aid']);
        exit;
    }

    private function handleSearchAdmin($data) {
        $sql = "SELECT *
            FROM admin
            WHERE username LIKE :search";
        $this->db->select(false, false, $sql, array('search' => '%'.$data['username'].'%'));

        if ($this->db->numRows > 0) {
            $data = array();
            while ($result = $this->db->getRow(true)) {
                array_push($data, $result);
            }
            echo json_encode(array('status' => 200, 'result' => $data));
        } else {
            echo json_encode(array('status' => 1015));
        }
        exit;
    }

    private function handleInsertAdmin($data) {

        $password = $this->common->generateRandomPassword($data['length']);
        $password_encrpt = $this->common->hashPassword($password);

        $params = array(
            'username' => $data['username'],
            'password' => $password_encrpt,
            'password_temp' => $password,
            'status' => 1
        );
        $this->db->insert('admin', $params);

        if ($this->db->lastInsertId) {
            $insert_id = $this->db->lastInsertId;

            // send an email
            // code here

            echo json_encode(array('status' => 200));
            $isSuccess = 1;
        } else {
            echo json_encode(array('status' => 1016));
            $isSuccess = 0;
        }

        $this->log->writeAdminLog($this->classAction, $data['action'], '#'.$insert_id.' '.$data['username'], $isSuccess, $data['aid']);
        exit;
    }

}

$admin = new Admin();

?>