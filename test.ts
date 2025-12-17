{
  "transactionId": "542196fe-1f62-4ec8-a6b7-78043fc6bc3b",
  "steps": [
    { 
      "step": 0, "timestamp": "2025-12-03T16:38:34.173Z", "state": "RECEIVED", 
      "stepName": "pol-sms-sync-async-gateway", "serviceName": "gateway", 
      "payload": [{"label": "INIT", "size": 1200, "data": {"body": "init"}}] 
    },
    { 
      "step": 2, "timestamp": "2025-12-03T16:38:34.195Z", "state": "SUCCESS", 
      "stepName": "pol-sms-initiator-service", "serviceName": "initiator",
      "outcome": "PAYMENT_COMPLETE_SUCCESS",
      "parameters": { "rule": "txn-report", "mode": "sync" },
      "payload": [{"label": "RULE", "size": 192, "data": {"rule": "pass"}}]
    },
    { 
      "step": 35, "timestamp": "2025-12-03T16:38:34.436Z", "state": "FAILED", 
      "stepName": "Gateway Handshake", "serviceName": "gateway",
      "outcome": "CALL_WATCHDOG_FAILED",
      "error": { "message": "Error 504: The upstream payment gateway timed out." },
      "payload": [{ "label": "GATEWAY_ERR", "size": 45, "data": { "code": "TIMEOUT" } }] 
    }
  ]
}
