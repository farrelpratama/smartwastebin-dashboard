const MQTT_CONFIG = {
  brokerUrl: 'wss://broker.hivemq.com:8884/mqtt',
  topic: 'iot/smartbin/status/kelompokiotlupabrp',
  clientId: 'WebDashboard-' + Math.random().toString(16).substring(2, 10)
};

document.getElementById('topicLabel').textContent = MQTT_CONFIG.topic;

const client = mqtt.connect(MQTT_CONFIG.brokerUrl, {
  clientId: MQTT_CONFIG.clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 2000
});

client.on('connect', () => {
  UI.setConnectionState('connected', 'Terhubung ke Broker');
  UI.addLog(`Terhubung ke ${MQTT_CONFIG.brokerUrl}`);

  client.subscribe(MQTT_CONFIG.topic, (err) => {
    if (!err) {
      UI.addLog(`Subscribe berhasil: ${MQTT_CONFIG.topic}`);
    } else {
      UI.addLog(`Subscribe gagal: ${err.message}`);
    }
  });
});

client.on('reconnect', () => UI.setConnectionState('', 'Menghubungkan ulang...'));

client.on('error', (err) => {
  UI.setConnectionState('disconnected', 'Koneksi Error');
  UI.addLog(`Error: ${err.message}`);
});

client.on('message', (_, payload) => {
  const rawText = payload.toString();
  UI.addLog(`Payload: ${rawText}`);

  try {
    const data = JSON.parse(rawText);
    UI.updateDashboard(data);
  } catch (e) {
    UI.addLog(`Format JSON tidak valid: ${e.message}`);
  }
});