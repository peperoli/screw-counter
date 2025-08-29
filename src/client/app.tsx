import { useEffect, useState } from 'preact/hooks'
import './app.css'

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
    <main class="p-6 text-center">
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
            class="bg-red-500 font-bold text-xl p-4 rounded-xl w-full"
          >
            Abbrechen
          </button>
        </section>
      )}
    </main>
  )
}

function Form() {
  return (
    <form class="grid gap-4">
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
      <button type="submit" class="bg-lime-500 font-bold text-xl p-4 rounded-xl w-full">
        Zähler starten
      </button>
    </form>
  )
}
