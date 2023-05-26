import Link from 'next/link'
import Logo from './logo'

export default function Header() {
  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          { /* Site branding */}
          <div className="shrink-0 mr-4">
            <Logo />
          </div>

          { /* Desktop navigation */}
          <nav className="flex grow">

            { /* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <Link className="font-medium text-sm text-slate-300 hover:text-white transition duration-150 ease-in-out" href="/signin">Sign in</Link>
              </li>
              <li className="ml-6">
                <Link className="btn-sm text-slate-300 hover:text-white transition duration-150 ease-in-out w-full group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none" href="/signup">
                  <span className="relative inline-flex items-center">
                    Sign up <span className="tracking-normal text-purple-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
                  </span>
                </Link>
              </li>
            </ul>

          </nav>

        </div>
      </div>
    </header>
  )
}
