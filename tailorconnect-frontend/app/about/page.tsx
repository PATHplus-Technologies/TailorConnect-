export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto p-8 py-16">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">About TailorConnect</h1>
            <div className="prose lg:prose-xl text-gray-600 space-y-6">
                <p>
                    TailorConnect is the premier platform bridging the gap between skilled tailors and fashion-forward individuals.
                    Born from the frustration of finding reliable tailors and managing measurements, we built a solution that makes custom clothing accessible to everyone.
                </p>
                <p>
                    Our mission is to empower local artisans by providing them with digital tools to showcase their work, while giving clients a seamless, trust-based experience.
                </p>
                <h2 className="text-2xl font-bold text-gray-800 mt-8">Why Choose Us?</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Verified Artisans:</strong> Every tailor on our platform is vetted for quality.</li>
                    <li><strong>Digital Convenience:</strong> Manage your sizes and orders in one place.</li>
                    <li><strong>Community Driven:</strong> We support local businesses and sustainable fashion.</li>
                </ul>
            </div>
        </div>
    );
}
