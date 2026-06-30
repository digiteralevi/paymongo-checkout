export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: false,
            show_description: true,
            show_line_items: true,
            success_url: 'https://digiteralevi.systeme.io/thevipaccess',
            cancel_url: 'https://digiteralevi.systeme.io/thevipaccess',
            line_items: [
              {
                currency: 'PHP',
                amount: 100,
                name: 'test product',
                quantity: 1
              }
            ],
            payment_method_types: ['gcash', 'card', 'paymaya', 'qrph']
          }
        }
      })
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ error: data.errors });
    }

    const checkoutUrl = data.data.attributes.checkout_url;
    res.writeHead(302, { Location: checkoutUrl });
    res.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
