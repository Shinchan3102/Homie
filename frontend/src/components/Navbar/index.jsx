import Logo from "../Logo"

const Navbar = () => {
  return (
    <div className="h-16 flex items-center justify-between gap-4 bg-primary-bg px-8 border-b">
      <Logo />

      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-muted-color" />
      </div>
    </div>
  )
}

export default Navbar
