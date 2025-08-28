import React from "react"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Button } from "../ui/button"

const Navbar = () => {
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <h1 className="text-2xl font-bold">
            Job<span className="text-[#F83002]">Portal</span>
          </h1>
        </div>

        <div className="flex items-center gap-5">
          <ul className="flex font-medium items-center gap-5">
            <li>Home</li>
            <li>Jobs</li>
            <li>Browse</li>
          </ul>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <p>Hello</p>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}

export default Navbar
