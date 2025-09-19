import mqtt from 'mqtt'

export function mqttClient() {
  const options = {
    host: '761aa76a827b4185897045398392da71.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'screw-counter-web',
    password: '8p2v3Wn3JIu4',
  } as const

  const client = mqtt.connect(options)

  client.on('error', function (error) {
    console.error(error)

    throw error
  })

  return client
}
