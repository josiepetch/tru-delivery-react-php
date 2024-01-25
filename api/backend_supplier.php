<?php

/** 
 * supplier.php
 * error code from 105X 
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

class Supplier {

    private $common;
    private $db;
    private $log;
    private $classTable = 'suppliers';
    private $classAction = 'supplier';

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
                case 'getSupplierList':
                    $this->handleSupplierList($data);
                    break;

                case 'deletSupplier':
                    $this->handleDeletSupplier($data);
                    break;

                case 'getSupplierDetail':
                    $this->handleSupplierDetail($data);
                    break;

                case 'insertSupplier':
                    $result = $this->handleAddSupplier($data);
                    break;

                case 'supplierResetPassword':
                    $this->handleSupplierResetPwd($data);
                    break;
            }
        }
    }

    private function handleSupplierList($data) {
        $search = '';
        if (isset($data['search']) && $data['search'] != '') {
            $search = "WHERE name LIKE '%".$data['search']."%' 
                OR contact LIKE '%".$data['search']."%' 
                OR email LIKE '%".$data['search']."%'";
        }
        $sql = "SELECT id, name, contact, email, phone, isactive
            FROM $this->classTable
            $search
            ORDER BY name ASC";

        $this->db->select(false, false, $sql);

        if ($this->db->numRows > 0) {
            $data = array();
            while ($result = $this->db->getRow(true)) {
                array_push($data, $result);
            }
            echo json_encode(array('status' => 200, 'result' => $data));
        } else {
            echo json_encode(array('status' => 1050));
        }
    }

    private function handleDeletSupplier($data) {
        $this->db->setTable($this->classTable);
        $this->db->delete('id = :id', false, array('id' => (int)$data['id']));

        if ($this->db->rowsAffected > 0) {
            echo json_encode(array('status' => 200));
            $isSuccess = 1;
        } else {
            echo json_encode(array('status' => 1051));
            $isSuccess = 0;
        }
        $this->log->writeAdminLog($this->classAction, $data['action'], '#'.$data['id'].' '.$data['email'], $isSuccess, $data['aid']);
        exit;
    }

    private function handleSupplierDetail($data) {
        $sql = "SELECT name, contact, email, phone, isactive
            FROM $this->classTable
            WHERE id = :id";

        $supplier = $this->db->selectFetchOne(false, false, $sql, array('id' => $data['id']));

        if ($supplier) {
            echo json_encode(array('status' => 200, 'result' => $supplier));
        } else {
            echo json_encode(array('status' => 1052));
        }
    }

    private function handleAddSupplier($data) {
        $password = $this->common->generateRandomPassword($data['length']);
        $password_encrpt = $this->common->hashPassword($password);

        $params = array(
            'name' => $data['supplier'],
            'contact' => $data['contact'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => $password_encrpt,
            'password_temp' => $password
        );
        $this->db->insert($this->classTable, $params);

        if ($this->db->lastInsertId) {
            $insert_id = $this->db->lastInsertId;

            // send an email
            // code here

            echo json_encode(array('status' => 200));
            $isSuccess = 1;
            $comment = '#'.$insert_id.' '.$data['email'];
        } else {
            $isSuccess = 0;
            $lastIndex = count($this->db->errorInfo->errorInfo)-1;
            $comment = $this->db->errorInfo->errorInfo[$lastIndex];
            echo json_encode(array('status' => 1053, 'message' => $comment));
        }

        $this->log->writeAdminLog($this->classAction, $data['action'], $comment, $isSuccess, $data['aid']);
        exit;
    }

    private function handleSupplierResetPwd($data) {
        $password = $this->common->generateRandomPassword($data['length']);
        $password_encrpt = $this->common->hashPassword($password);

        $this->db->setTable($this->classTable);
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
            
            $isSuccess = 1;
            echo json_encode(array('status' => 200));
        } else {
            $isSuccess = 0;
            echo json_encode(array('status' => 1054));
        }

        $this->log->writeAdminLog($this->classAction, $data['action'], '#'.$data['id'], $isSuccess, $data['aid']);
        exit;
    }

}

$supplier = new Supplier();

?>