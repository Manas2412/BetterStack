'use client'
import { Activity, Bell, BarChart3, Globe, Shield, Zap, ArrowRight, Check, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLogoDark, setIsLogoDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
      setIsLogoDark(saved === 'dark');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsLogoDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isLogoDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark, isLogoDark]);

  const router = useRouter()

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-950' : 'bg-white'}`}>
      <nav className={`fixed top-0 w-full z-50 ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'} backdrop-blur-md border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-emerald-600" />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>UpMonitor</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => {
                setIsDark(!isDark);
                setIsLogoDark(!isLogoDark);
              }} className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button onClick={() => {
                router.push("/signup")
              }} className="bg-emerald-800 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                Start Free Trial
              </button>
              <button onClick={() => {
                router.push("/signin")
              }} className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className={`pt-32 pb-20 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-950' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium mb-8 ${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
              <Zap className="h-4 w-4" />
              <span>Monitor your infrastructure with confidence</span>
            </div>
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Keep your services <span className="text-emerald-600">always online</span>
            </h1>
            <p className={`text-xl mb-10 leading-relaxed max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor uptime, track performance, and manage incidents across all your websites and APIs.
              Get instant alerts when things go wrong and beautiful status pages to keep everyone informed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl flex items-center space-x-2 group">
                <span>Start monitoring for free</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className={`border-2 px-8 py-4 rounded-lg transition-all font-semibold text-lg ${isDark ? 'border-gray-700 text-gray-300 hover:border-gray-600' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}>
                View live demo
              </button>
            </div>
            <p className={`mt-6 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>

      <section className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>99.99%</div>
              <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Uptime SLA</div>
            </div>
            <div>
              <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>30s</div>
              <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Check frequency</div>
            </div>
            <div>
              <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>15+</div>
              <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Global locations</div>
            </div>
            <div>
              <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>24/7</div>
              <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Support available</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className={`py-24 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-950' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Everything you need to stay online</h2>
            <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive monitoring tools designed to keep your services running smoothly
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`p-8 rounded-2xl border transition-all ${isDark ? 'bg-gray-900 border-gray-800 hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20' : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg'}`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Uptime Monitoring</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Monitor HTTP, HTTPS, TCP, DNS, and more. Get alerted instantly when your services go down from 15+ global locations.
              </p>
            </div>
            <div className={`p-8 rounded-2xl border transition-all ${isDark ? 'bg-gray-900 border-gray-800 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/20' : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg'}`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Instant Alerts</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Receive notifications via email, SMS, Slack, Discord, and more. On-call scheduling with escalation policies included.
              </p>
            </div>
            <div className={`p-8 rounded-2xl border transition-all ${isDark ? 'bg-gray-900 border-gray-800 hover:border-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20' : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg'}`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDark ? 'bg-cyan-900/30' : 'bg-cyan-100'}`}>
                <Globe className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Status Pages</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Beautiful, customizable status pages to keep your users informed. Host on your domain with full branding control.
              </p>
            </div>
            <div className={`p-8 rounded-2xl border transition-all ${isDark ? 'bg-gray-900 border-gray-800 hover:border-orange-600 hover:shadow-lg hover:shadow-orange-500/20' : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg'}`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDark ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Performance Analytics</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Track response times, SSL certificate expiration, and detailed performance metrics with beautiful dashboards.
              </p>
            </div>
            <div className={`p-8 rounded-2xl border transition-all ${isDark ? 'bg-gray-900 border-gray-800 hover:border-rose-600 hover:shadow-lg hover:shadow-rose-500/20' : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg'}`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDark ? 'bg-rose-900/30' : 'bg-rose-100'}`}>
                <Shield className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Incident Management</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Streamline incident response with automated workflows, post-mortems, and team collaboration tools.
              </p>
            </div>
            <div className={`p-8 rounded-2xl border transition-all ${isDark ? 'bg-gray-900 border-gray-800 hover:border-violet-600 hover:shadow-lg hover:shadow-violet-500/20' : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg'}`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDark ? 'bg-violet-900/30' : 'bg-violet-100'}`}>
                <Zap className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>API Integrations</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Connect with your existing tools via webhooks, REST API, and native integrations with popular platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className={`py-24 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 to-cyan-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Simple, transparent pricing</h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Choose the plan that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className={`p-8 rounded-2xl border hover:shadow-xl transition-shadow ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Starter</h3>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>$29</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>10 monitors</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>1 minute checks</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>1 status page</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Email alerts</span>
                </li>
              </ul>
              <button className={`w-full py-3 rounded-lg transition-colors font-semibold ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                Start free trial
              </button>
            </div>
            <div className={`p-8 rounded-2xl border-4 hover:shadow-2xl transition-shadow relative ${isDark ? 'bg-emerald-600/10 border-emerald-600' : 'bg-emerald-600 border-emerald-500'}`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-emerald-400' : 'text-white'}`}>Professional</h3>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${isDark ? 'text-emerald-400' : 'text-white'}`}>$79</span>
                <span className={isDark ? 'text-emerald-300/70' : 'text-emerald-100'}>/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-100'}`} />
                  <span className={isDark ? 'text-emerald-300' : 'text-white'}>50 monitors</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-100'}`} />
                  <span className={isDark ? 'text-emerald-300' : 'text-white'}>30 second checks</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-100'}`} />
                  <span className={isDark ? 'text-emerald-300' : 'text-white'}>5 status pages</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-100'}`} />
                  <span className={isDark ? 'text-emerald-300' : 'text-white'}>SMS & integrations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-100'}`} />
                  <span className={isDark ? 'text-emerald-300' : 'text-white'}>On-call scheduling</span>
                </li>
              </ul>
              <button className={`w-full py-3 rounded-lg transition-colors font-semibold ${isDark ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-white text-emerald-600 hover:bg-gray-50'}`}>
                Start free trial
              </button>
            </div>
            <div className={`p-8 rounded-2xl border hover:shadow-xl transition-shadow ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Enterprise</h3>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Unlimited monitors</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>10 second checks</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Unlimited status pages</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Priority support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Custom SLA</span>
                </li>
              </ul>
              <button className={`w-full py-3 rounded-lg transition-colors font-semibold ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                Contact sales
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-24 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-950' : 'bg-gray-900'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-white'}`}>
            Start monitoring in minutes
          </h2>
          <p className={`text-xl mb-10 ${isDark ? 'text-gray-400' : 'text-gray-300'}`}>
            Join thousands of companies that trust us to keep their services online
          </p>
          <button className="bg-emerald-600 text-white px-10 py-4 rounded-lg hover:bg-emerald-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl inline-flex items-center space-x-2">
            <span>Get started free</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      <footer className={`border-t py-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-900 border-gray-800'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-6 w-6 text-emerald-600" />
                <span className="text-lg font-bold text-white">UpMonitor</span>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Monitor your infrastructure with confidence and keep your services always online.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-white'}`}>Features</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-white'}`}>Pricing</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-white'}`}>API</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-white'}`}>Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-white'}`}>About</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-white'}`}>Blog</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-white'}`}>Careers</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-white'}`}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-white'}`}>Privacy</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-white'}`}>Terms</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-white'}`}>Security</a></li>
                <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-white'}`}>Status</a></li>
              </ul>
            </div>
          </div>
          <div className={`border-t pt-8 text-center text-sm ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-800 text-gray-400'}`}>
            <p>&copy; 2024 UpMonitor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
