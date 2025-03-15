'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Markdown from 'react-markdown'
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json'
import KeyManagerContract from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json'
// Import the LSP7 ABI
import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json'
import LSP7ABI from './abi/lsp7.json'
import { ethers } from 'ethers'
import { useUpProvider } from './contexts/UpProvider'
import Web3 from 'web3'
import styles from './page.module.scss'

// export const metadata = {
//   title: 'Acme Dashboard',
//   description: 'The official Next.js Course Dashboard, built with App Router.',
// }

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({ list: [] })
  const [conversation, setConversation] = useState([])
  const inputRef = useRef()
  const auth = useUpProvider()

  const sendMessage = (e) => {
    e.preventDefault()

    const q = inputRef.current.value
    if (q === '') return

    let newData = data.list
    newData.push({ type: `q`, content: q })
    setData({ list: newData })

    // Reset the form
    e.target.reset()

    window.setTimeout(() => {
      document.querySelector(`output`).scrollTop = document.querySelector(`output`).scrollHeight
    }, 100)

    // Cal the OpenAI
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      profile: {
        role: 'system',
        content: `Connected wallet address ${JSON.stringify(auth.accounts[0])}`,
      },
      old_messages: conversation,
      messages: {
        role: 'user',
        content: `${q}`,
      },
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    // Call OpenAI
    setIsLoading(true)

    fetch('/api/openai', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)

        let newData = data.list
        newData.push({ type: `a`, content: result.output.content })
        setData({ list: newData })

        let newConversationData = conversation
        newConversationData.push(result.output)
        setConversation(newConversationData)
        // console.log(conversation)
        setIsLoading(false)

        window.setTimeout(() => {
          document.querySelector(`output`).scrollTop = document.querySelector(`output`).scrollHeight
        }, 500)
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    console.clear()
  }, [])
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {data.list.length === 0 && (
          <div className={`${styles.hi} d-flex flex-column align-items-center justify-content-center`}>
            <Image className={styles.hero} src="/arfi.png" alt="Next.js logo" width={240} height={240} priority />
            <h1 className={`text-center`}>PumpRoom</h1>
            <p>Tokenize anything, instantly. Watch AI create and deploy LSP7 tokens on LUKSO, right before your eyes.</p>
          </div>
        )}

        <output>
          {data.list.length > 0 &&
            data.list.map((item, i) => {
              return (
                <div key={i} className={`${styles.message} ms-motion-slideDownIn`} data-message-type={item.type}>
                  {item.type === `a` && <Image className={styles.logo} src={`/arf-i-pfp.png`} alt="pfp" width={48} height={48} priority />}
                  <div className={`${styles.message__content}`} data-message-type={item.type} id="typewriter">
                    <Markdown>{item.content}</Markdown>
                  </div>
                </div>
              )
            })}

          {isLoading && (
            <>
              <div className={`${styles.message} ms-motion-slideDownIn`} data-message-type={`a`}>
                <Image className={styles.logo} src={`/arf-i-pfp.png`} alt="pfp" width={48} height={48} priority />
                <div className={`${styles.message__content}`} data-message-type={`a`}>
                  <Markdown>Please wait...</Markdown>
                </div>
              </div>
            </>
          )}
        </output>
      </main>

      <footer className={styles.footer}>
        <form method="POST" onSubmit={(e) => sendMessage(e)}>
          <input ref={inputRef} type={`text`} placeholder={`Ask ${process.env.NEXT_PUBLIC_NAME}`} />
          <button style={{ background: `pink`, color: `white` }}>send</button>
        </form>
      </footer>
    </div>
  )
}
