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

interface Node {
  coords: number[]
  moves: string[]
  pointsRemaining: number
  path: string[]
  prizesCollected: Prize[]
}

interface Prize {
  coords: number[]
  value: number
}


const testInput = JSON.parse(readFileSync("input.json", "utf8")) as Input

console.log(solveMaze(testInput))

function solveMaze(input: Input): string {
  const index = buildIndexer(input.size)

  const map: Node[] = []
  for (const space of input.spaces) {
    const coords = input.dimensions.map(dimension => space[dimension])
    if (!map[index(coords)]) {
      map[index(coords)] = {
        coords,
        moves: space.moves,
        pointsRemaining: 0,
        path: [],
        prizesCollected: []
      }
    } else {
      throw new Error(`${space.x}, ${space.y} already exists!`)
    }
  }

  const startCoords = parseStringCoords(input.start)
  map[index(startCoords)].pointsRemaining = input.spaces.length

  const prizes: Prize[] = []
  for (const prizeCoord in input.prizes) {
    const coords = parseStringCoords(prizeCoord)
    prizes[index(coords)] = {
      coords,
      value: input.prizes[prizeCoord]
    }
  }

  const queue: Node[] = [map[index(startCoords)]]

  while (queue.length) {
    // printMap(map, input.size)
    queue.sort((a, b) => b.pointsRemaining - a.pointsRemaining)
    const currentNode = queue.shift()!

    for (let i = 0; i < input.dimensions.length; i++) {
      if (currentNode.moves.includes(input.dimensions[i])) {
        const prospectiveCoords = [...currentNode.coords]
        prospectiveCoords[i]--
        const prospectiveNode = map[index(prospectiveCoords)]

        let newPointsRemaining = currentNode.pointsRemaining - 1

        let hasPrize = false
        const prize = prizes[index(prospectiveCoords)]
        if (prize && !prospectiveNode.prizesCollected.includes(prize)) {
          newPointsRemaining += prize.value
          hasPrize = true
        }

        if (prospectiveNode.pointsRemaining < newPointsRemaining) {
          prospectiveNode.pointsRemaining = newPointsRemaining
          prospectiveNode.path = currentNode.path.concat(input.dimensions[i])
          if (hasPrize) {
            prospectiveNode.prizesCollected.push(prize)
          }
          if (!queue.includes(prospectiveNode)) {
            queue.push(prospectiveNode)
          }
        }
      }

      if (currentNode.moves.includes(input.dimensions[i].toUpperCase())) {
        const prospectiveCoords = [...currentNode.coords]
        prospectiveCoords[i]++
        const prospectiveNode = map[index(prospectiveCoords)]

        let newPointsRemaining = currentNode.pointsRemaining - 1

        let hasPrize = false
        const prize = prizes[index(prospectiveCoords)]
        if (prize && !prospectiveNode.prizesCollected.includes(prize)) {
          newPointsRemaining += prize.value
          hasPrize = true
        }

        if (prospectiveNode.pointsRemaining < newPointsRemaining) {
          prospectiveNode.pointsRemaining = newPointsRemaining
          prospectiveNode.path = currentNode.path.concat(input.dimensions[i].toUpperCase())
          if (hasPrize) {
            prospectiveNode.prizesCollected.push(prize)
          }
          if (!queue.includes(prospectiveNode)) {
            queue.push(prospectiveNode)
          }
        }
      }
    }
  }

  const endCoords = parseStringCoords(input.end)
  const endNode = map[index(endCoords)]

  return `${endNode.path.join("")}: ${endNode.pointsRemaining}`
}


function buildIndexer(size: number): (coords: number[]) => number {
  return (coords: number[]) => coords.reduce((result, coord, index) => result + coord * size ** index, 0)
}


function parseStringCoords(coords: string): number[] {
  const noParens = coords.replace(/\(|\)/g, "")
  const split = noParens.split(",")
  const numbers = split.map(coord => Number(coord))
  return numbers
}


function printMap(map: Node[], size: number): void {
  const width = map.length.toString(10).length
  const out: string[] = []

  for (let i = 0; i < map.length; i += size) {
    const row = map.slice(i, i + size)
    out.push(row.map(node => node.pointsRemaining.toString(10).padStart(width)).join(" "))
  }

  console.debug(out.join("\n"))
}
