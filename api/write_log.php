<?php

include_once('db.php');

class Log {

    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function writeAdminLog($module, $action, $comment, $status, $id = null) {
        $params = array(
            'admin_id' => $id,
            'module' => $module,
            'action' => $action,
            'comment' => $comment,
            'isSuccess' => $status,
            'date_added' => date('Y-m-d H:i:s')
        );

        $this->db->insert('admin_log', $params);
    }

    public function writeSupplierLog($module, $action, $comment, $status, $id = null) {
        $params = array(
            'supplier_id' => $id,
            'module' => $module,
            'action' => $action,
            'comment' => $comment,
            'isSuccess' => $status,
            'date_added' => date('Y-m-d H:i:s')
        );

        $this->db->insert('suppliers_log', $params);
    }
}

?>