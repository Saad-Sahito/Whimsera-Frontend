"use client";
import { useState } from "react";

import Navbar from "../components/Navbar";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PricingPage() {
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

    const plans = [
        {
            id: "free",
            name: "Free Plan",
            price: "$0",
            period: "Forever",
            description: "Start your magical journey",
            features: [
                { text: "5,000 words/month", icon: "✨" },
                { text: "1 new story start", icon: "📖" },
                // { text: "Classic creation tools", icon: "✍️" },
                { text: "Community content access", icon: "🌟" },
            ],
            cta: "Begin Your Adventure",
            highlighted: true,
            color: "from-[#6C5CE7] to-[#00BFA6]",
        },
        {
            id: "basic",
            name: "Basic Plan",
            price: "$29",
            period: "/month",
            description: "For curious readers",
            features: [
                { text: "50,000 words/month", icon: "📝" },
                { text: "3 new story starts", icon: "🎭" },
                { text: "Priority support", icon: "💬" },
                // { text: "Story analytics", icon: "📊" },
                // { text: "Custom themes", icon: "🎨" },
            ],
            cta: "Choose Basic",
            highlighted: true,
            color: "from-[#00BFA6] to-[#74C0FC]",
        },
        {
            id: "pro",
            name: "Pro Plan",
            price: "$59",
            period: "/month",
            description: "For passionate readers",
            features: [
                { text: "100,000 words/month", icon: "🚀" },
                { text: "6 new story starts", icon: "✨" },
                // { text: "Priority support", icon: "👑" },
                // { text: "Advanced analytics", icon: "📈" },
                // { text: "Collaboration tools", icon: "🤝" },
                { text: "Export to multiple formats", icon: "💾" },
            ],
            cta: "Unlock Pro",
            highlighted: true,
            color: "from-[#FF7675] to-[#FFD166]",
        },
        // {
        //     id: "unlimited",
        //     name: "Unlimited Plan",
        //     price: "$99",
        //     period: "/month",
        //     description: "For boundless imagination",
        //     features: [
        //         { text: "Unlimited words", icon: "∞" },
        //         { text: "Unlimited story starts", icon: "🌌" },
        //         { text: "24/7 dedicated support", icon: "⭐" },
        //         { text: "White-label options", icon: "🏢" },
        //         // { text: "API access", icon: "⚙️" },
        //         { text: "Premium community perks", icon: "💎" },
        //     ],
        //     cta: "Live Unlimited",
        //     highlighted: false,
        //     color: "from-[#6C5CE7] to-[#FF7675]",
        // },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" as const },
        },
    };

    return (
        <div className="min-h-screen pb-20" style={{ paddingTop: "120px" }}>
            <Navbar />
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16 px-4"
            >
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4" style={{ color: "#2D3436" }}>
                    Choose Your <span style={{ color: "#6C5CE7" }}>Magical Tier</span>
                </h1>
                <p className="text-lg sm:text-xl" style={{ color: "#6C5CE7" }}>
                    Unlock your storytelling potential with a plan designed for every dreamer
                </p>
            </motion.div>

            {/* Pricing Cards Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-20 auto-rows-fr"
            >
                {plans.map((plan) => (
                    <motion.div
                        key={plan.id}
                        variants={cardVariants}
                        onMouseEnter={() => setHoveredPlan(plan.id)}
                        onMouseLeave={() => setHoveredPlan(null)}
                        className={`relative group rounded-2xl p-8 transition-all duration-300 h-full flex flex-col justify-between ${plan.highlighted
                                ? "lg:scale-105 shadow-2xl"
                                : hoveredPlan === plan.id
                                    ? "shadow-xl"
                                    : "shadow-lg"
                            }`}
                        style={{
                            background: "white",
                            border: plan.highlighted ? "2px solid #FFD166" : "1px solid #E5E5E5",
                        }}
                    >

                        {/* Animated gradient border effect */}
                        {plan.highlighted && (
                            <motion.div
                                className="absolute inset-0 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    background: `linear-gradient(135deg, #6c5ce762, #00bfa67e, #ffd16667)`,
                                    filter: "blur(10px)",
                                }}
                            />
                        )}

                        {/* Plan header */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-bold" style={{ color: "#2D3436" }}>
                                    {plan.price}
                                </span>
                                <span className="text-sm" style={{ color: "#6C5CE7" }}>
                                    {plan.period}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1" style={{ color: "#2D3436" }}>
                                {plan.name}
                            </h3>
                            <p className="text-sm" style={{ color: "#6C5CE7" }}>
                                {plan.description}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="h-px mb-6" style={{ background: "linear-gradient(90deg, transparent, #E5E5E5, transparent)" }} />

                        {/* Features list */}
                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="flex items-start gap-3"
                                >
                                    <span className="text-xl mt-0.5">{feature.icon}</span>
                                    <span style={{ color: "#2D3436" }} className="font-medium">
                                        {feature.text}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-full py-3 px-4 rounded-lg font-bold text-base transition-all duration-300 ${plan.highlighted
                                    ? "text-white shadow-lg hover:shadow-xl"
                                    : "text-[#2D3436]"
                                }`}
                            style={{
                                background: plan.highlighted
                                    ? `linear-gradient(135deg, #6C5CE7 0%, #FF7675 100%)`
                                    : "#FFD166",
                            }}
                        >
                            {plan.cta}
                        </motion.button>

                        {/* Badge for highlighted plan */}
                        {/* {plan.highlighted && (
                            <div
                                className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold text-white shadow-lg"
                                style={{ background: "linear-gradient(135deg, #6C5CE7 0%, #FF7675 100%)" }}
                            >
                                ⭐ Most Popular
                            </div>
                        )} */}
                    </motion.div>
                ))}
            </motion.div>

            {/* Features Comparison Section */}
            {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto px-4 mb-20"
            >
                <h2 className="text-4xl font-bold text-center mb-12" style={{ color: "#2D3436" }}>
                    Magical Features Across All Plans
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        { icon: "📖", title: "Story Editor", desc: "Craft tales with our intuitive interface" },
                        { icon: "✨", title: "AI Assistance", desc: "Get writing suggestions powered by magic" },
                        { icon: "🎭", title: "Character Tools", desc: "Develop rich, memorable characters" },
                        { icon: "📚", title: "Story Library", desc: "Organize and manage all your works" },
                        { icon: "🌍", title: "Community", desc: "Connect with fellow storytellers" },
                        { icon: "💡", title: "Prompts & Ideas", desc: "Never face writer's block again" },
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-6 rounded-xl"
                            style={{ background: "white", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
                        >
                            <div className="text-4xl mb-3">{feature.icon}</div>
                            <h3 className="font-bold text-lg mb-1" style={{ color: "#2D3436" }}>
                                {feature.title}
                            </h3>
                            <p style={{ color: "#6C5CE7" }}>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div> */}

            {/* FAQ Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto px-4"
            >
                <h2 className="text-4xl font-bold text-center mb-12" style={{ color: "#2D3436" }}>
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {[
                        {
                            q: "Can I upgrade or downgrade anytime?",
                            a: "Absolutely! Switch between plans at any time. Changes take effect immediately.",
                        },
                        {
                            q: "What happens to my stories if I downgrade?",
                            a: "Your stories remain safe in your library. You'll only be limited by the monthly word count of your new plan.",
                        },
                        {
                            q: "Do unused words roll over to the next month?",
                            a: "No, your word count resets at the beginning of each billing cycle, but every word you use brings you closer to your next masterpiece.",
                        },
                        {
                            q: "Is there a free trial for paid plans?",
                            a: "We believe in letting the magic speak for itself. Start free and upgrade whenever you're ready!",
                        },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-xl"
                            style={{ background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                        >
                            <h3 className="font-bold text-lg mb-2" style={{ color: "#2D3436" }}>
                                ❓ {item.q}
                            </h3>
                            <p style={{ color: "#6C5CE7" }}>{item.a}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-20 text-center px-4"
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#2D3436" }}>
                    Ready to unleash your imagination?
                </h2>
                <p className="text-lg mb-8" style={{ color: "#6C5CE7" }}>
                    Join thousands of storytellers creating magic every day
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-lg font-bold text-lg text-white shadow-lg hover:shadow-xl transition"
                    style={{
                        background: "linear-gradient(135deg, #6C5CE7 0%, #00BFA6 100%)",
                    }}
                >
                    Start Creating Free ✨
                </motion.button>
            </motion.div>
        </div>
    );
}