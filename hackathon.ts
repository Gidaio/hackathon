import { readFileSync } from "fs"

interface Input {
  dimensions: string[]
  size: number
  start: string
  end: string
  spaces: any[]
  prizes: {
    [coords: string]: number
  }
}

interface DjikstraSpace {
  coords: number[]
  moves: string[]
  pointsRemaining: number
  path: string[]
  prizesCollected: string[]
}


const testInput = JSON.parse(readFileSync("input.json", "utf8")) as Input

console.log(solveMaze(testInput))

function solveMaze(input: Input): string {
  const djikstraSpaces = input.spaces.map(space => {
    const out: DjikstraSpace = {
      coords: input.dimensions.map(dimension => space[dimension]),
      moves: space.moves.split(""),
      pointsRemaining: 0,
      path: [],
      prizesCollected: []
    }

    if (buildCoordsString(out.coords) === input.start) {
      out.pointsRemaining = input.spaces.length
    }

    return out
  })

  const unvisitedSpaces = [...djikstraSpaces]

  while (unvisitedSpaces.length) {
    const currentSpace = unvisitedSpaces.sort((a, b) => b.pointsRemaining - a.pointsRemaining).shift()!

    if (buildCoordsString(currentSpace.coords) === input.end) {
      console.log("Points remaining:", currentSpace.pointsRemaining)
      return currentSpace.path.join("")
    }

    for (const direction of currentSpace.moves) {
      const neighborCoords = [...currentSpace.coords]
      if (input.dimensions.includes(direction)) {
        neighborCoords[input.dimensions.indexOf(direction)]--
      } else {
        neighborCoords[input.dimensions.indexOf(direction.toLowerCase())]++
      }

      const neighborSpace = djikstraSpaces[getIndex(neighborCoords, input.size)]

      let prizeBonus = 0
      if (input.prizes[buildCoordsString(neighborSpace.coords)] && !neighborSpace.prizesCollected.includes(buildCoordsString(neighborSpace.coords))) {
        prizeBonus = input.prizes[buildCoordsString(neighborSpace.coords)]
      }

      if (currentSpace.pointsRemaining - 1 + prizeBonus > neighborSpace.pointsRemaining) {
        neighborSpace.pointsRemaining = currentSpace.pointsRemaining - 1 + prizeBonus
        neighborSpace.path = [...currentSpace.path, direction]

        if (prizeBonus) {
          neighborSpace.prizesCollected.push(buildCoordsString(neighborSpace.coords))
        }

        if (unvisitedSpaces.findIndex(space => buildCoordsString(space.coords) === buildCoordsString(neighborSpace.coords)) === -1) {
          unvisitedSpaces.push(neighborSpace)
        }
      }
    }

    let dummy = 0
  }

  return "no path"
}


function buildCoordsString(coords: number[]): string {
  return `(${coords.join(",")})`
}


function getIndex(coords: number[], size: number): number {
  let index = 0
  let multiplier = 1
  for (let i = coords.length - 1; i >= 0; i--) {
    index += coords[i] * multiplier
    multiplier *= size
  }

  return index
}
