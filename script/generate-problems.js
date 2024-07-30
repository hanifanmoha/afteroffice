const fs = require('fs')
function num2Array(a) {
  return (a + '').split('').map(x => parseInt(x))
}

function removeDuplicate(arr) {
  const tmp = {}
  for (let v of arr) {
    tmp[v] = true
  }
  return Object.keys(tmp).map(x => parseInt(x)).sort()
}

function convert2Str(a, b, c) {
  const arrDuplicates = [...num2Array(a), ...num2Array(b), ...num2Array(c)]
  const arrUnique = removeDuplicate(arrDuplicates)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, arrUnique.length).split('')
  const maps = {}
  for (let i = 0; i < chars.length; i++) {
    maps[arrUnique[i]] = chars[i]
  }

  return [
    num2Array(a).map(v => maps[v]).join(''),
    num2Array(b).map(v => maps[v]).join(''),
    num2Array(c).map(v => maps[v]).join(''),
  ].join('_')
}

function run() {

  const maxValue = 999

  const problemMap = {}

  for (let a = 10; a <= maxValue; a++) {
    for (let b = 10; b <= a; b++) {
      const c = a + b
      if (c >= maxValue) continue
      const str = convert2Str(a, b, c)
      if (problemMap[str]) {
        problemMap[str].push({ a, b, c })
      } else {
        problemMap[str] = [{ a, b, c }]
      }
    }
  }

  // for (let key of Object.keys(problemMap)) {
  //   if (problemMap[key].length === 1) {
  //     console.log(key, problemMap[key][0])
  //   }
  // }

  const problemSet = Object.keys(problemMap).filter(key => {
    return problemMap[key].length === 1
  })

  fs.writeFile('./problem_set.json', JSON.stringify(problemSet, null, 2), 'utf-8', () => console.log('done'))

}

run() 