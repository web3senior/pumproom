'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Web3 from 'web3'
import Icon from '../helper/MaterialIcon'
import { useAuth } from '../contexts/UpProvider'
import styles from './ConnectWallet.module.scss'
import Shimmer from '../helper/Shimmer'

export default function ConnectWallet() {
  const auth = useAuth()

  return (
    <div className={`${styles.connect} d-flex align-items-center justify-content-center`}>
      {auth.status === `loading` && <Shimmer style={{ width: `250px`, height: `45px` }} />}
      
      {!auth.wallet && <button onClick={auth.connect}>Connect</button>}

      {auth.profile && (
        <Link href={`#`}>
          <ul className={`${styles['wallet']} d-flex flex-row align-items-center justify-content-end`}>
            <li className={`d-flex flex-row align-items-center justify-content-center`}>
              {auth.balance}
              <div style={{ color: `var(--LUKSO)` }}>
                <span>⏣</span>
                <small style={{ fontSize: `12px`, position: `relative`, top: `-1px` }}>LYX</small>
              </div>
            </li>
            <li className={`d-flex flex-row align-items-center justify-content-end`}>
              <Image
                className={`rounded`}
                alt={auth.profile && auth.profile.LSP3Profile.name}
                title={auth.wallet && `${auth.wallet.slice(0, 4)}...${auth.wallet.slice(38)}`}
                width={40}
                height={40}
                priority
                src={`https://ipfs.io/ipfs/${auth.profile.LSP3Profile.profileImage.length > 0 && auth.profile.LSP3Profile.profileImage[0].url.replace('ipfs://', '').replace('://', '')}`}
              />
              <span>{`${auth.wallet.slice(0, 4)}...${auth.wallet.slice(38)}`}</span>
              <Icon name={'keyboard_arrow_down'} />
            </li>
          </ul>
        </Link>
      )}      
    </div>
  )
}
