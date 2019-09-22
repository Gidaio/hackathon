import { readFileSync } from "fs"

interface Input {
  dimensions: string[]
  size: number
  start: string
  end: string
  spaces: any[]
}

interface DjikstraSpace {
  coords: number[]
  moves: string[]
  pointsRemaining: number
  previousSpace: { space: DjikstraSpace, direction: string } | null
}


const testInput = JSON.parse(readFileSync("test-input.json", "utf8")) as Input

console.log(solveMaze(testInput))

function solveMaze(input: Input): string {
  const djikstraSpaces = input.spaces.map(space => {
    const out: DjikstraSpace = {
      coords: input.dimensions.map(dimension => space[dimension]),
      moves: space.moves.split(""),
      pointsRemaining: 0,
      previousSpace: null
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
      const path: string[] = []
      for (let space = currentSpace; !!space.previousSpace; space = space.previousSpace!.space) {
        path.unshift(space.previousSpace!.direction)
      }

      return `${path.join("")}: ${currentSpace.pointsRemaining}`
    }

    for (const direction of currentSpace.moves) {
      const neighborCoords = [...currentSpace.coords]
      if (input.dimensions.includes(direction)) {
        neighborCoords[input.dimensions.indexOf(direction)]--
      } else {
        neighborCoords[input.dimensions.indexOf(direction.toLowerCase())]++
      }

      const neighborSpace = djikstraSpaces[getIndex(neighborCoords, input.size)]
      if (currentSpace.pointsRemaining - 1 > neighborSpace.pointsRemaining) {
        neighborSpace.pointsRemaining = currentSpace.pointsRemaining - 1
        neighborSpace.previousSpace = { space: currentSpace, direction  }
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
