import cx from 'classnames'

interface IDigitProps {
  char: string
  status?: 'valid' | 'invalid' | 'normal'
  value?: string
}

interface IButtonInput {
  char: string
}

function Digit({ char, status = 'normal', value }: IDigitProps) {
  return (
    <div
      className={cx('m-2 bg-slate-600 rounded-lg p-1', {
        'bg-yellow-600': status === 'invalid',
        'bg-green-700': status === 'valid',
      })}
    >
      <div
        className={
          'w-20 h-20 rounded-lg border-gray-700 bg-slate-900 text-4xl font-bold flex justify-center items-center'
        }
      >
        {value}
      </div>
      <div className='p-1 text-center font-bold text-slate-300'>{char}</div>
    </div>
  )
}

function ButtonInput({ char }: IButtonInput) {
  return (
    <div className='bg-gray-500 rounded-lg w-24 h-12 flex justify-center items-center mx-1 my-2 text-2xl hover:bg-gray-700 cursor-pointer font-semibold'>
      {char}
    </div>
  )
}

export default function Home() {
  return (
    <main className='flex min-h-screen w-full max-w-xl flex-col items-center justify-between m-auto text-white'>
      {/* Board */}
      <div className='pt-8'>
        <div className='flex flex-row justify-end mb-4 px-8'>
          <Digit char='A' status='invalid' value='1' />
          <Digit char='D' status='valid' value='2' />
          <Digit char='A' value='3' />
        </div>
        <div className='flex flex-row justify-end mb-4 px-8'>
          <Digit char='D' />
          <Digit char='I' />
        </div>
        <div className='flex flex-col items-end'>
          <p className='text-xl'>+</p>
          <hr className='min-w-full border-2 mb-4' />
        </div>
        <div className='flex flex-row justify-end mb-4 px-8'>
          <Digit char='D' />
          <Digit char='I' />
          <Digit char='A' />
        </div>
      </div>
      {/* Keyboard */}
      <div className='pb-8'>
        <div className='flex flex-row'>
          <ButtonInput char='1' />
          <ButtonInput char='2' />
          <ButtonInput char='3' />
        </div>
        <div className='flex flex-row'>
          <ButtonInput char='4' />
          <ButtonInput char='5' />
          <ButtonInput char='6' />
        </div>
        <div className='flex flex-row'>
          <ButtonInput char='7' />
          <ButtonInput char='8' />
          <ButtonInput char='9' />
        </div>
        <div className='flex flex-row'>
          <ButtonInput char='' />
          <ButtonInput char='0' />
          <ButtonInput char='x' />
        </div>
      </div>
    </main>
  )
}
