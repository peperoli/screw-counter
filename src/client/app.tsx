import { useEffect, useState } from 'preact/hooks'
import './app.css'
import mqtt from 'mqtt'

export function App() {
  const [state, setState] = useState<'idle' | 'counting' | 'success'>('idle')
  const [count, setCount] = useState(0)
  const searchParams = new URLSearchParams(window.location.search)
  const amount = searchParams.get('amount')

  useEffect(() => {
    if (amount) {
      setState('counting')
    }
  }, [amount])

  return (
    <main class="p-6 text-center max-w-lg mx-auto mt-32 font-sans">
      <section>
        <h1 class="text-4xl font-bold">Schraubenzähler</h1>
        <p class="mb-6">Don't screw the counter, count the screws.</p>
        {state === 'idle' && <Form />}
        {state === 'counting' && (
          <section class="grid gap-4">
            <p class="text-7xl font-bold">
              {count}
              <span class="text-gray-400">/{amount}</span>
            </p>
            <button
              onClick={() => setState('idle')}
              class="bg-red-500 font-bold text-xl p-4 rounded-xl w-full cursor-pointer"
            >
              Abbrechen
            </button>
          </section>
        )}
      </section>
    </main>
  )
}

function Form() {
  async function onSubmit(event: Event) {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const amount = formData.get('amount')

    try {
      if (!amount) {
        throw new Error('Bitte eine Menge angeben')
      }

      const options = {
        host: '761aa76a827b4185897045398392da71.s1.eu.hivemq.cloud',
        port: 8883,
        protocol: 'mqtts',
        username: 'screw-counter-web',
        password: '8p2v3Wn3JIu4',
      } as const
      const client = await mqtt.connectAsync(options)

      client.on('connect', function () {
        console.log('Connected')
      })

      client.on('error', function (error) {
        console.log(error)
        throw error
      })

      client.on('message', function (topic, message) {
        console.log('Received message:', topic, message.toString())
      })

      client.subscribe('hello')

      client.publish('hello', 'Hello from Preact App!')
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Unbekannter Fehler')
    }
  }

  return (
    <form onSubmit={onSubmit} class="grid gap-4">
      <fieldset class="flex border rounded-xl items-center">
        <label htmlFor="amount" class="text-xl whitespace-nowrap px-4 text-gray-600">
          Menge:
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          min="1"
          defaultValue="100"
          class=" p-4 text-xl rounded-r-xl w-full"
        />
      </fieldset>
      <button
        type="submit"
        class="bg-lime-500 font-bold text-xl p-4 rounded-xl w-full cursor-pointer"
      >
        Zähler starten
      </button>
    </form>
  )
}
