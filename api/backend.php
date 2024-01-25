<?php

// php -S localhost:8000
// npm run dev

/*
 * backend.php
 * error code from 100X
 * */

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

class Backend {
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
                case 'login':
                    $this->handleLogin($data);
                    break;
            }
        }
    }

    private function handleLogin($data) {
        if ($data['username'] == '' || $data['password'] == '') {
            echo json_encode(array('status' => 1000));
            exit;
        }

        $sql = "SELECT *
            FROM admin
            WHERE username = :username
            LIMIT 1";
        $admin = $this->db->selectFetchOne(false, false, $sql, 
            array('username' => $data['username']));

        if ($admin) {

            if ($this->common->verifyPassword($data['password'], $admin['password'])) {
                $secretKey = 'P1yxtvnJ9a';

                $user = [
                    'id' => $admin['id'],
                    'expired' => date('Y-m-d H:i', strtotime('+1 day'))
                ];

                $token = JWT::encode($user, $secretKey, 'HS256');

                echo json_encode(array('status' => 200, 'token' => $token));
                $isSuccess = 1;
                $sid = $admin['id'];
            } else {
                echo json_encode(array('status' => 1000));
                $isSuccess = 0;
                $sid = 0;
            }
        } else {
            echo json_encode(array('status' => 1000));
            $isSuccess = 0;
            $sid = 0;
        }

        $this->log->writeAdminLog('login', $data['action'], null, $isSuccess, $sid);
        exit;
    }

}

$backend = new Backend();

?>