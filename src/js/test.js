export function getResultTable(groups, answers){
  let res = groups
  res = res.map( group => {
    let r = 0
    let s = answers
      .filter(answer => answer.gid === group.id)
      .reduce((s,answer) => s + answer.answerWeight, 0)

    let s1 = (s-5)/25 * 100
    let tp = 0
    if( s1 < 21){
      tp = 0
    }
    if(s1 >= 21 && s1 < 41) {
      tp = 1
    }
    if(s1 >= 41 && s1 < 61) {
      tp = 2
    }
    if(s1 >= 61 && s1 < 81) {
      tp = 3
    }
    if(s1 >= 81 && s1 <= 100) {
      tp = 4
    }


    return {...group, s, s1, r, tp }
  })
  return res.sort((a,b) => b.s - a.s)
}

export function isDestructiveProgram(resultTable, index){
  return index < 3 ||
    index === 3 && resultTable[index].s === resultTable[index - 1].s ||
    index === 4 && resultTable[index].s === resultTable[index - 1].s && resultTable[index - 1].s === resultTable[index - 2].s ||
    index === 5 && resultTable[index].s === resultTable[index - 1].s && resultTable[index - 1].s === resultTable[index - 2].s && resultTable[index - 2].s === resultTable[index - 3].s
}
export function getDestructiveGroupsIds(resultTable){
  const ids = []
  for(let index = 0; index < resultTable.length && index < 7; index++){
    if(index < 3 ||
      index === 3 && resultTable[index].s === resultTable[index - 1].s ||
      index === 4 && resultTable[index].s === resultTable[index - 1].s && resultTable[index - 1].s === resultTable[index - 2].s ||
      index === 5 && resultTable[index].s === resultTable[index - 1].s && resultTable[index - 1].s === resultTable[index - 2].s && resultTable[index - 2].s === resultTable[index - 3].s
    ){
      ids.push(resultTable[index].id)
    }
  }
  return ids
}
