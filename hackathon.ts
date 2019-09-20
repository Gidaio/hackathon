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

function solveMaze(input: Input) {
  const startingPoints = input.spaces.length

  const visitedSpaces = []
}


function getSpaceByCoords(spaces: InputSpace[], coords: string): InputSpace {

}
