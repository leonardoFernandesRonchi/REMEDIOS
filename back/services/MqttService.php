<?php

namespace App\Services;

use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;

class MqttService
{
    public function publish($topic, $message)
    {
        $server   = env('MQTT_HOST');
        $port     = env('MQTT_PORT');
        $username = env('MQTT_USERNAME');
        $password = env('MQTT_PASSWORD');

        $clientId = 'laravel-client-' . uniqid();

        $mqtt = new MqttClient($server, $port, $clientId);

        $connectionSettings = (new ConnectionSettings)
            ->setUsername($username)
            ->setPassword($password);

        $mqtt->connect($connectionSettings, true);

        $mqtt->publish($topic, $message, 0);

        $mqtt->disconnect();
    }
}