import { readFileSync } from "fs"

type Dimension = "x" | "y" | "z" | "v" | "w"

interface Input {
  dimensions: string[]
  size: number
  spaces: InputSpace[]
  start: string
  end: string
  prizes: { [location: string]: number }
}

interface InputSpace {
  x: number
  y: number
  z: number
  v: number
  w: number
  moves: string
}

interface SpaceWithPoints {
  x: number
  y: number
  z: number
  v: number
  w: number
  moves: string
  pointsRemaining: number
  movesMade: string[]
}

type Space = InputSpace | SpaceWithPoints


const input: Input = JSON.parse(readFileSync("input.json", "utf8"))
input.size = 5

solveMaze(input)

function solveMaze(input: Input) {
  const startingPoints = input.spaces.length

  const spacesToVisit: SpaceWithPoints[] = [
    {
      ...input.spaces[getIndexByCoords(parseStringCoords(input.start))],
      pointsRemaining: startingPoints,
      movesMade: []
    }
  ]
  const visitedSpaces: SpaceWithPoints[] = []

  while (spacesToVisit.length) {
    spacesToVisit.sort((a, b) => b.pointsRemaining - a.pointsRemaining)
    const spaceToVisit = spacesToVisit.shift()!

    const directions = spaceToVisit.moves.split("") as Dimension[]

    for (const direction of directions) {
      let potentialCoords = {
        ...spaceToVisit,
      }
      if (input.dimensions.includes(direction)) {
        potentialCoords[direction]--
      } else {
        potentialCoords[direction.toLowerCase() as Dimension]++
      }

      const potentialSpace = {
        ...input.spaces[getIndexByCoords(getCoords(potentialCoords))],
        movesMade: [...spaceToVisit.movesMade, direction],
        pointsRemaining: spaceToVisit.pointsRemaining - 1
      }

      if (buildStringCoords(potentialSpace) === input.end) {
        console.log(`Found route: ${potentialSpace.movesMade.join("")}. Have ${potentialSpace.pointsRemaining} points left.`)
        continue
      }

      // If we've already visited the space
      const previouslyVisitedSpaceIndex = visitedSpaces.findIndex(isSameSpace(potentialSpace))
      if (previouslyVisitedSpaceIndex !== -1) {
        // If we got to it faster, remove it from the visited list and add it to the to visit list.
        if (visitedSpaces[previouslyVisitedSpaceIndex].pointsRemaining < potentialSpace.pointsRemaining) {
          visitedSpaces.splice(previouslyVisitedSpaceIndex, 1)
          spacesToVisit.push(potentialSpace)
        }
        // Otherwise, ignore this.
      } else {
        // If we haven't visited the space.
        const toVisitSpaceIndex = spacesToVisit.findIndex(isSameSpace(potentialSpace))
        if (toVisitSpaceIndex !== -1) {
          // If it's in the to visit list, keep the higher score.
          spacesToVisit[toVisitSpaceIndex].pointsRemaining = Math.max(spacesToVisit[toVisitSpaceIndex].pointsRemaining, potentialSpace.pointsRemaining)
        } else {
          spacesToVisit.push(potentialSpace)
        }
      }
    }

    visitedSpaces.push(spaceToVisit)
  }
}


function getCoords(space: Space): number[] {
  return [space.x, space.y, space.z, space.v, space.w]
}


function parseStringCoords(coords: string): number[] {
  const coordParts = coords.split(",")
  return coordParts.map(coord => {
    const sanitizedCoord = coord.replace(/\(|\)/g, "")
    return Number(sanitizedCoord)
  })
}

function buildStringCoords(space: Space): string {
  return `(${space.x},${space.y},${space.z},${space.v},${space.w})`
}


function isSameSpace(space: Space) {
  return (candidateSpace: Space) =>
    candidateSpace.x === space.x &&
    candidateSpace.y === space.y &&
    candidateSpace.z === space.z &&
    candidateSpace.v === space.v &&
    candidateSpace.w === space.w
}


function getIndexByCoords(coords: number[]): number {
  return coords[0] * 625 + coords[1] * 125 + coords[2] * 25 + coords[3] * 5 + coords[4]
}
