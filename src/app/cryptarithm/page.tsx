'use client'

import cx from 'classnames'
import { useCallback, useEffect, useMemo, useState } from 'react'

type IDigitInputText = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

interface IDigitProps {
  char: string
  isActive?: boolean
  status?: 'valid' | 'invalid' | 'normal'
  value?: string
  onSelect: () => void
}

interface IButtonInput {
  char: string
  onSelect: () => void
}

function Digit({
  char,
  status = 'normal',
  value,
  isActive,
  onSelect,
}: IDigitProps) {
  return (
    <div
      onClick={onSelect}
      className={cx('m-2  rounded-lg p-1', {
        'bg-slate-600': status === 'normal',
        'bg-yellow-600': status === 'invalid',
        'bg-green-700': status === 'valid',
      })}
    >
      <div
        className={cx(
          'w-14 h-14 rounded-lg bg-slate-900 text-3xl font-bold flex justify-center items-center',
          {
            'border-2 border-yellow-200': isActive,
          }
        )}
      >
        {value}
      </div>
      <div className='p-1 text-center font-bold text-slate-300'>{char}</div>
    </div>
  )
}

function ButtonInput({ char, onSelect }: IButtonInput) {
  return (
    <button
      onClick={onSelect}
      className='bg-gray-500 rounded-lg w-24 h-12 flex justify-center items-center mx-1 my-2 text-2xl hover:bg-gray-700 cursor-pointer font-semibold'
    >
      {char}
    </button>
  )
}

export default function Home() {
  const problemString = 'ADA_DI_DIA'

  const [problem] = useState<string[][]>(
    problemString.split('_').map((s) => s.split(''))
  )

  const [values, setValues] = useState<string[][]>(
    problemString.split('_').map((s) => s.split('').map((c) => ''))
  )

  const [activeIndex, setActiveIndex] = useState(0)

  const isAllFilled = useMemo<boolean>(() => {
    for (let row of values) {
      for (let v of row) {
        if (!v) {
          return false
        }
      }
    }
    return true
  }, [values])

  const isCharValid = useMemo<boolean[][]>(() => {
    const vals: { [key: string]: string[] } = {}

    for (let r = 0; r < values.length; r++) {
      for (let c = 0; c < values[r].length; c++) {
        if (!values[r][c]) continue
        const p = problem[r][c]
        const v = values[r][c]
        if (!vals[p]) {
          vals[p] = [v]
        } else if (!vals[p].includes(v)) {
          vals[p].push(v)
        }
      }
    }

    return problem.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        const p = problem[rowIndex][colIndex]
        const v = values[rowIndex][colIndex]
        if (!v) return true
        if (!vals[p]) return true
        return vals[p].length === 1
      })
    })
  }, [values, problem])

  const isSumValid = useMemo<boolean[]>(() => {
    if (!isAllFilled) {
      return values[2].map((v) => true)
    }
    const digit1 = values[0].join('')
    const digit2 = values[1].join('')
    const sum = parseInt(digit1) + parseInt(digit2)
    const sumArr = (sum + '').split('')
    return values[2].map((v, idx) => v === sumArr[idx])
  }, [values, isAllFilled])

  const isSolved = useMemo<boolean>(() => {
    if (!isAllFilled) {
      return false
    }
    for (let r = 0; r < values.length; r++) {
      for (let c = 0; c < values[r].length; c++) {
        if (!isCharValid[r][c]) {
          return false
        }
        if (r === 2 && !isSumValid[c]) {
          return false
        }
      }
    }
    return true
  }, [isAllFilled, isCharValid, isSumValid])

  const isActive = useCallback(
    (rowIndex: number, colIndex: number): boolean => {
      const idx = rc2Idx(problem, rowIndex, colIndex)
      return idx === activeIndex
    },
    [problem, activeIndex]
  )

  const handleSelectDigit = (rowIndex: number, colIndex: number) => {
    const idx = rc2Idx(problem, rowIndex, colIndex)
    setActiveIndex(idx)
  }

  const handleInput = (val: string) => {
    if (isSolved) {
      return
    }
    const [r, c] = idx2RC(problem, activeIndex)
    if (r < 0 || c < 0) return

    // Handle Delete
    if (val === 'X') {
      // Delete Current Index
      if (values[r][c] !== '') {
        const newValues = [...values]
        newValues[r][c] = ''
        setValues(newValues)

        // Delete previous index
      } else {
        const prevIdx = Math.max(0, activeIndex - 1)
        const [r2, c2] = idx2RC(problem, prevIdx)
        const newValues = [...values]
        newValues[r2][c2] = ''
        setValues(newValues)
        setActiveIndex(prevIdx)
      }
    } else if (val === '') {
    } else {
      const newValues = [...values]
      newValues[r][c] = val
      setValues(newValues)
      if (activeIndex < maxIdx(problem)) {
        setActiveIndex((curr) => curr + 1)
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ('0123456789'.includes(event.key)) {
        handleInput(event.key)
      }
      if (event.key === 'Backspace') {
        handleInput('X')
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [handleInput])

  const digitStatus = useCallback(
    (
      rowIndex: number,
      colIndex: number,
      validateSum: boolean = false
    ): 'valid' | 'invalid' | 'normal' => {
      if (isSolved) {
        return 'valid'
      }
      if (!isCharValid[rowIndex][colIndex]) {
        return 'invalid'
      }
      if (validateSum && !isSumValid[colIndex]) {
        return 'invalid'
      }
      return 'normal'
    },
    [values, isCharValid, isSolved]
  )

  return (
    <main className='flex min-h-screen w-full max-w-xl flex-col items-center justify-between m-auto text-white pb-8'>
      {/* Board */}
      <div className='pt-8'>
        <div className='flex flex-row justify-end mb-1 px-8'>
          {problem[0] &&
            problem[0].map((c, i) => (
              <Digit
                key={`${0}--${i}`}
                char={c}
                value={values[0][i]}
                isActive={isActive(0, i)}
                onSelect={() => handleSelectDigit(0, i)}
                status={digitStatus(0, i)}
              />
            ))}
        </div>
        <div className='flex flex-row justify-end mb-1 px-8'>
          {problem[1] &&
            problem[1].map((c, i) => (
              <Digit
                key={`${1}--${i}`}
                char={c}
                value={values[1][i]}
                isActive={isActive(1, i)}
                onSelect={() => handleSelectDigit(1, i)}
                status={digitStatus(1, i)}
              />
            ))}
        </div>
        <div className='flex flex-col items-end'>
          <p className='text-xl'>+</p>
          <hr className='min-w-full border-2 mb-3' />
        </div>
        <div className='flex flex-row justify-end mb-1 px-8'>
          {problem[2] &&
            problem[2].map((c, i) => (
              <Digit
                key={`${2}--${i}`}
                char={c}
                value={values[2][i]}
                isActive={isActive(2, i)}
                onSelect={() => handleSelectDigit(2, i)}
                status={digitStatus(2, i, true)}
              />
            ))}
        </div>
      </div>
      {/* Keyboard */}
      <div className='pb-8'>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['', '0', 'X'],
        ].map((row, rowIdx) => (
          <div key={rowIdx} className='flex flex-row'>
            {row.map((c, colIdx) => (
              <ButtonInput
                key={`${rowIdx}--${colIdx}`}
                char={c}
                onSelect={() => handleInput(c)}
              />
            ))}
          </div>
        ))}
      </div>
    </main>
  )
}

function rc2Idx(problem: string[][], r: number, c: number): number {
  let _idx = 0
  for (let i = 0; i < problem.length; i++) {
    for (let j = 0; j < problem[i].length; j++) {
      if (r === i && c === j) {
        return _idx
      }
      _idx++
    }
  }
  return _idx
}

function idx2RC(problem: string[][], idx: number): number[] {
  let _idx = 0
  for (let i = 0; i < problem.length; i++) {
    for (let j = 0; j < problem[i].length; j++) {
      if (idx === _idx) {
        return [i, j]
      }
      _idx++
    }
  }
  return [-1, -1]
}

function maxIdx(problem: string[][]) {
  let cnt = 0
  for (let i = 0; i < problem.length; i++) {
    cnt += problem[i].length
  }
  return cnt - 1
}
