// Content for every footer "info" link. Keyed by the slug used in /info/:slug.
// type: 'paragraphs' | 'faq' | 'table'

const infoContent = {
    faqs: {
        title: 'FAQs',
        type: 'faq',
        items: [
            { q: 'How long does shipping take?', a: 'Standard orders ship within 1–2 business days and arrive in 3–7 business days depending on your location. You\'ll get a tracking link by email as soon as it ships.' },
            { q: 'Can I change or cancel my order?', a: 'If your order hasn\'t shipped yet, contact us right away and we\'ll do our best to update or cancel it. Once it\'s shipped, you can use our Returns and Exchanges process instead.' },
            { q: 'Do you ship internationally?', a: 'Currently we ship within the US only. International shipping is on our roadmap — join the mailing list to be the first to know when it opens up.' },
            { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, Apple Pay, Google Pay, and PayPal at checkout.' },
            { q: 'How do I know what size to order?', a: 'Check our General Size Chart for measurements in inches. If you\'re between sizes, customer reviews on each product page usually mention fit.' },
            { q: 'I got a discount code from leaving a review — how do I use it?', a: 'Reviews that include a photo automatically generate a one-time discount code shown right after you submit. Apply it at checkout in the promo code field.' },
        ],
    },

    returns: {
        title: 'Returns and Exchanges',
        type: 'paragraphs',
        sections: [
            { text: 'We want you to love what you ordered. If something\'s not right, you have 30 days from delivery to request a return or exchange.' },
            { heading: 'Eligibility', text: 'Items must be unworn, unwashed, and in their original condition with tags attached. Final sale items (marked as such on the product page) aren\'t eligible for return.' },
            { heading: 'How to start a return', text: 'Email us at hello@jerrycloths.com with your order number and what you\'d like to return or exchange. We\'ll send you a prepaid return label and next steps.' },
            { heading: 'Refunds', text: 'Once we receive your return, refunds are processed to your original payment method within 5–7 business days.' },
        ],
    },

    terms: {
        title: 'Terms of Service',
        type: 'paragraphs',
        sections: [
            { text: 'By using the Jerry Cloths website and placing an order, you agree to the terms below.' },
            { heading: 'Orders & Pricing', text: 'All prices are listed in USD and may change without notice. We reserve the right to limit quantities or refuse any order at our discretion.' },
            { heading: 'Product Accuracy', text: 'We do our best to display colors and details accurately, but slight variations may occur due to screen settings and manufacturing.' },
            { heading: 'Account Responsibility', text: 'You\'re responsible for keeping your account credentials secure and for any activity that happens under your account.' },
            { heading: 'Intellectual Property', text: 'All site content — designs, photography, logos, and text — belongs to Jerry Cloths and may not be reused without permission.' },
        ],
    },

    privacy: {
        title: 'Privacy Policy',
        type: 'paragraphs',
        sections: [
            { text: 'Your privacy matters to us. This page explains what we collect and how it\'s used.' },
            { heading: 'What we collect', text: 'Account details (name, email), order and shipping information, and — only if you choose to subscribe — your email address for product drop notifications.' },
            { heading: 'How we use it', text: 'To process orders, respond to support requests, and (only with your consent) send updates about new arrivals. We never sell your data to third parties.' },
            { heading: 'Your choices', text: 'You can unsubscribe from emails at any time, and you can request account deletion by contacting us.' },
        ],
    },

    'size-chart': {
        title: 'General Size Chart',
        type: 'table',
        intro: 'Measurements in inches. For the best fit, compare these to a similar piece of clothing you already own.',
        columns: ['Size', 'Chest', 'Waist', 'Hip', 'Length'],
        rows: [
            ['XS', '34–36', '28–30', '34–36', '26'],
            ['S', '36–38', '30–32', '36–38', '27'],
            ['M', '38–40', '32–34', '38–40', '28'],
            ['L', '40–42', '34–36', '40–42', '29'],
            ['XL', '42–44', '36–38', '42–44', '30'],
            ['XXL', '44–46', '38–40', '44–46', '31'],
        ],
    },

    shipping: {
        title: 'Shipping and Delivery Policy',
        type: 'paragraphs',
        sections: [
            { heading: 'Processing Time', text: 'Orders are processed and packed within 1–2 business days. You\'ll receive a confirmation email with tracking once your order ships.' },
            { heading: 'Delivery Estimates', text: 'Standard shipping: 3–7 business days. Express shipping: 1–3 business days, available at checkout for an additional fee.' },
            { heading: 'Shipping Costs', text: 'Free standard shipping on orders over $75. Otherwise, shipping cost is calculated at checkout based on your location and order weight.' },
            { heading: 'Lost or Damaged Packages', text: 'If your package arrives damaged or doesn\'t arrive at all, contact us within 7 days of the expected delivery date and we\'ll sort it out.' },
        ],
    },

    'our-story': {
        title: 'Our Story',
        type: 'paragraphs',
        sections: [
            { text: 'Jerry Cloths started as a small idea: clothing that feels as good as it looks, made for people who don\'t want to choose between comfort and style.' },
            { text: 'Every piece is designed in-house with our customers in mind — quality fabric, fit that actually fits, and details that hold up to daily wear.' },
            { text: 'We\'re still a small, independent brand, and every order means a lot to us. Thanks for being part of it.' },
        ],
    },

    careers: {
        title: 'Careers',
        type: 'paragraphs',
        sections: [
            { text: 'We\'re a small, growing team and we\'re always open to hearing from people who love what we\'re building.' },
            { text: 'We don\'t have open roles posted right now, but if you think you\'d be a great fit, send your resume and a short note about why you\'re interested to hello@jerrycloths.com — we read every message.' },
        ],
    },

    'store-location': {
        title: 'Store Location',
        type: 'paragraphs',
        sections: [
            { text: 'Jerry Cloths is currently an online-only brand — we don\'t have a physical storefront open to walk-ins yet.' },
            { heading: 'Studio / Customer Service', text: 'Los Angeles, CA\n(818) 206-8764\nhello@jerrycloths.com' },
            { text: 'Follow us on Instagram and TikTok for pop-up events and announcements about a future physical location.' },
        ],
    },

    'gift-card': {
        title: 'Gift Card',
        type: 'paragraphs',
        sections: [
            { text: 'Digital gift cards are coming soon! We\'re working on adding them to checkout so you can send the perfect gift to anyone, any amount.' },
            { text: 'In the meantime, the easiest way to gift Jerry Cloths is to share a discount code — get in touch with us and we can help.' },
        ],
    },

    rewards: {
        title: 'Rewards',
        type: 'paragraphs',
        sections: [
            { text: 'Our current rewards program is simple: leave a review with a photo on any product you\'ve purchased, and you\'ll instantly receive a one-time discount code at checkout.' },
            { text: 'We\'re working on a full points-based rewards program for the future — subscribing below means you\'ll be the first to know when it launches.' },
        ],
    },

    'shipping-protection': {
        title: 'Shipping Protection',
        type: 'paragraphs',
        sections: [
            { text: 'Shipping protection covers your order against loss, theft, or damage in transit, so if something goes wrong on the way to you, we\'ll make it right at no extra cost to track down.' },
            { text: 'This option isn\'t available as an add-on at checkout just yet — for now, if your package is lost or arrives damaged, just contact us and we\'ll handle it directly.' },
        ],
    },
};

export default infoContent;