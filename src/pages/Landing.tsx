import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, CheckCircle, Shield, Zap, Smartphone, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500/30">
      {/* Nav */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-green-500">KC TELECOM</div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#rates" className="hover:text-white transition-colors">Rates</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-zinc-400 hover:text-white">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Turn Your Extra Airtime <br /> <span className="text-green-500">Into Instant Cash</span>
            </h1>
            <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-10">
              Nigeria's most reliable VTU platform for Airtime-to-Cash, Data-to-Cash, and instant bill payments. Secure, fast, and trusted by thousands.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 h-14 rounded-full">
                  Start Converting Now <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900 h-14 px-8 rounded-full">
                View Today's Rates
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-2xl blur-2xl" />
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/5192bcb4-f4f4-46e8-ab38-a2d711ccaf55/hero-image-1afa5393-1783603683059.webp" 
              alt="KC Telecom App" 
              className="relative rounded-2xl border border-zinc-800 shadow-2xl mx-auto max-w-4xl w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose KC TELECOM?</h2>
            <p className="text-zinc-400">Everything you need to manage your mobile assets efficiently.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Instant Conversion', 
                desc: 'Convert your MTN, Airtel, GLO, and 9mobile airtime to cash in seconds.',
                icon: Zap
              },
              { 
                title: 'Secure Wallet', 
                desc: 'Your funds are safe in our encrypted wallet system. Withdraw anytime to your bank.',
                icon: Shield
              },
              { 
                title: 'Multi-Network Support', 
                desc: 'We support all major Nigerian networks for both airtime and data conversion.',
                icon: Smartphone
              },
              { 
                title: 'Fast Payouts', 
                desc: 'Receive your money directly into your local bank account instantly.',
                icon: Wallet
              },
              { 
                title: 'Vendor Benefits', 
                desc: 'Earn commissions on every transaction as a registered vendor.',
                icon: CheckCircle
              },
              { 
                title: 'Best Rates', 
                desc: 'We offer the most competitive conversion rates in the market.',
                icon: Zap
              },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl border border-zinc-900 bg-black hover:border-green-500/50 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-green-900/40 to-black p-12 rounded-3xl border border-green-500/20 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-zinc-400 mb-10 text-lg">Join over 10,000 users who trust KC TELECOM for their VTU needs.</p>
            <Link to="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-10 rounded-full h-14">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-bold text-green-500">KC TELECOM</div>
          <div className="text-zinc-500 text-sm">
            © 2024 KC TELECOM. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Facebook</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
