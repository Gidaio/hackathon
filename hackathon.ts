import { readFileSync } from "fs"

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

interface MySpaces {
  x: number
  y: number
  z: number
  v: number
  w: number
  moves: string
  pointsRemaining: number
}


const input: Input = JSON.parse(readFileSync("input.json", "utf8"))
input.size = 5

solveMaze(input)

function solveMaze(input: Input) {
  const startingPoints = input.spaces.length

  const visitedSpaces: MySpaces[] = [
    { ...getSpaceByCoords(input.spaces, parseStringCoords(input.start)), pointsRemaining: startingPoints }
  ]
}


function parseStringCoords(coords: string): number[] {
  const coordParts = coords.split(",")
  return coordParts.map(coord => {
    const sanitizedCoord = coord.replace(/\(|\)/g, "")
    return Number(sanitizedCoord)
  })
}


function getSpaceByCoords(spaces: InputSpace[], coords: number[]): InputSpace {
  const index = coords[0] * 625 + coords[1] * 125 + coords[2] * 25 + coords[3] * 5 + coords[4]

  return spaces[index]
}
