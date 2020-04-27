import * as Hapi from '@hapi/hapi';
import Nexmo from 'nexmo';

const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });

    const nexmo = new Nexmo({
        apiKey: process.env.VONAGE_API_KEY,
        apiSecret: process.env.VONAGE_API_SECRET,
      });

    server.route({
        method: 'POST',
        path: '/',
        handler: (request, h) => {
            console.log(request.payload);
            const from = 'Logz.IO Alert';
            const to = process.env.PHONE;
            const { alert_title } = request.payload;
            const text = `The alert ${alert_title} has been triggered, please check your Logz.IO Dashboard`;

            (nexmo as any).message.sendSms(from, to, text);
            return {};
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();