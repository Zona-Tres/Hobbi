export const metadata = {
  title: 'Sign Up - Stellar',
  description: 'Page description',
}

import Link from 'next/link'
import AuthLogo from '../auth-logo'

export default function SignUp() {
  return (
    <>
      { /* Page header */}
      <div className="max-w-3xl mx-auto text-center pb-12">
        { /* Logo */}
        <AuthLogo />
        { /* Page title */}
        <h1 className="h2 bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60">Create your free account</h1>
      </div>

      { /* Form */}
      <div className="max-w-sm mx-auto">

        <form>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 font-medium mb-1" htmlFor="company">Company <span className="text-rose-500">*</span></label>
              <input id="company" className="form-input w-full" type="text" placeholder="mE.g., Acme Inc." required />
            </div>
            <div>
              <label className="block text-sm text-slate-300 font-medium mb-1" htmlFor="full-name">Full Name <span className="text-rose-500">*</span></label>
              <input id="full-name" className="form-input w-full" type="text" placeholder="E.g., Mark Rossi" required />
            </div>
            <div>
              <label className="block text-sm text-slate-300 font-medium mb-1" htmlFor="email">Email <span className="text-rose-500">*</span></label>
              <input id="email" className="form-input w-full" type="email" placeholder="markrossi@company.com" required />
            </div>
            <div>
              <label className="block text-sm text-slate-300 font-medium mb-1" htmlFor="password">Password <span className="text-rose-500">*</span></label>
              <input id="password" className="form-input w-full" type="password" autoComplete="on" required />
            </div>
            <div>
              <label className="block text-sm text-slate-300 font-medium mb-1" htmlFor="referrer">Where did you hear about us? <span className="text-rose-500">*</span></label>
              <select id="referrer" className="form-select text-sm py-2 w-full" required>
                <option>Google</option>
                <option>Medium</option>
                <option>GitHub</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button className="btn text-sm text-white bg-purple-500 hover:bg-purple-600 w-full shadow-sm group">
              Sign Up <span className="tracking-normal text-purple-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <div className="text-sm text-slate-400">
            Already have an account? <Link className="font-medium text-purple-500 hover:text-purple-400 transition duration-150 ease-in-out" href="/signin">Sign in</Link>
          </div>
        </div>

        { /* Divider */}
        <div className="flex items-center my-6">
          <div className="border-t border-slate-800 grow mr-3" aria-hidden="true" />
          <div className="text-sm text-slate-500 italic">or</div>
          <div className="border-t border-slate-800 grow ml-3" aria-hidden="true" />
        </div>

        { /* Social login */}
        <div className="flex space-x-3">
          <button className="btn text-slate-300 hover:text-white transition duration-150 ease-in-out w-full group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none h-9">
            <span className="relative">
              <span className="sr-only">Continue with Twitter</span>
              <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="15" height="12">
                <path d="M14.77 1.385c-.555.277-1.108.369-1.755.461.647-.37 1.108-.923 1.293-1.661-.554.369-1.2.553-1.939.738A3.223 3.223 0 0 0 10.154 0C8.584 0 7.2 1.385 7.2 3.046c0 .277 0 .462.092.646C4.8 3.6 2.492 2.4 1.015.554c-.277.461-.369.923-.369 1.57 0 1.014.554 1.938 1.385 2.491-.462 0-.923-.184-1.385-.369a2.98 2.98 0 0 0 2.4 2.954c-.277.092-.554.092-.83.092-.185 0-.37 0-.554-.092a2.99 2.99 0 0 0 2.861 2.123c-1.015.83-2.308 1.292-3.785 1.292H0C1.385 11.446 2.954 12 4.615 12c5.539 0 8.585-4.615 8.585-8.585v-.369c.646-.461 1.2-1.015 1.57-1.661Z" />
              </svg>
            </span>
          </button>
          <button className="btn text-slate-300 hover:text-white transition duration-150 ease-in-out w-full group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none h-9">
            <span className="relative">
              <span className="sr-only">Continue with GitHub</span>
              <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="16" height="15">
                <path d="M7.488 0C3.37 0 0 3.37 0 7.488c0 3.276 2.153 6.084 5.148 7.113.374.094.468-.187.468-.374v-1.31c-2.06.467-2.527-.936-2.527-.936-.375-.843-.843-1.124-.843-1.124-.655-.468.094-.468.094-.468.749.094 1.123.75 1.123.75.655 1.216 1.778.842 2.153.654.093-.468.28-.842.468-1.03-1.685-.186-3.37-.842-3.37-3.743 0-.843.281-1.498.75-1.966-.094-.187-.375-.936.093-1.965 0 0 .655-.187 2.059.749a6.035 6.035 0 0 1 1.872-.281c.655 0 1.31.093 1.872.28 1.404-.935 2.059-.748 2.059-.748.374 1.03.187 1.778.094 1.965.468.562.748 1.217.748 1.966 0 2.901-1.778 3.463-3.463 3.65.281.375.562.843.562 1.498v2.059c0 .187.093.468.561.374 2.996-1.03 5.148-3.837 5.148-7.113C14.976 3.37 11.606 0 7.488 0Z" />
              </svg>
            </span>
          </button>
        </div>

      </div>
    </>
  )
}
