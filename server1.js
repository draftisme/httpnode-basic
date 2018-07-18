const http = require('http');
const fs = require('fs');
const os = require('os');
const port = '8080';
const qs = require('qs');
const nodemailer = require('nodemailer');

const students = [
    {
        name:'Susansa',
        gender:'female',
        country:'Finland'
    },
    {
        name:'Jaya',
        gender:'Male',
        country:'Finland'
    }
    ,{
        name:'Shora',
        gender:'male',
        country:'Finland'
    }
]

http.createServer((req, res) => {
    if(req.url === '/' || req.url === '/home') {
        fs.readFile('index1.html', (err, data) => {
            if(err){
                return console.log(err);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        })
    } 
    else if(req.url === '/about'){
        res.writeHead(200, {'Content-Type': 'text/text'});
        res.write('ABOUT PAGE');
        res.end();
    }
    else if(req.url === '/contact'){
        if(req.method === 'POST'){
            let body = '';
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ninadang97@gmail.com',
                    pass: 'khanhdang97'
                }
            })
            let mailOptions = {}
            req.on('data', chunk => {
                body = qs.parse(chunk.toString());
                mailOptions = {
                    from: 'ninadang97@gmail.com',
                    to: body.email,
                    subject: 'Thank you!',
                    html: `
                        <h3>Hi, ${body.firstName} ${body.lastName}!</h3>
                        <p>${body.msg}</p>
                        <p><strong>Do not reply to this message.</strong> This email is sent to <em>${body.email}</em></p>

                        <div>
                            Sincerely, <br />
                            Nina Dang, Firm Consultant
                        </div>
                    `
                }
            })
            req.on('end', () => {
                console.log(body);
                transporter.sendMail(mailOptions, (e,info) => {
                    if(e){
                        console.log(e)
                    }
                    else{
                        console.log('Email sent: ' + info.response)
                    }
                })
                res.end('You form is submitted. Please check your email. Thank you!');
            });
        } else if(req.method='GET') {
            fs.readFile('contact.html', (err, data) => {
                if(err){ 
                    return console.log(err);
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            })
        }
        
    }
    else if(req.url === '/test'){
        if(req.method === 'POST'){
            let body = '';
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ninadang97@gmail.com',
                    pass: 'khanhdang97'
                }
            })
            let mailOptions = {}
            req.on('data', chunk => {
                body = qs.parse(chunk.toString());
                mailOptions = {
                    from: 'ninadang97@gmail.com',
                    to: body.email,
                    subject: 'Thank you for subscribing our channel!',
                    html: `<h1>Hi, ${body.firstName} ${body.lastName}!</h1>`
                }
            })
            req.on('end', () => {
                transporter.sendMail(mailOptions, (e, info) => {
                    if(e){
                        console.log(e);
                    } else{
                        console.log('Email send: ' + info.response);
                    }
                })
                res.end('Sent.');
            })
        } else {            
            res.end(`
                <!doctype html>
                <html>
                <body>
                    <form action='/test' method='post'>
                        <input type='text' name='firstName' placeholder="First Name" /><br />
                        <input type='text' name='lastName' placeholder="Last Name" /><br />
                        <input type='email' name='email' placeholder="Email" /><br />
                        <button>Submit</button>
                    </form>
                </body> 
                </html> 
            `)
        }
    }

    const username = os.hostname();
    const pageUrl = req.url;
    const date = new Date();
    const IPAddress = os.networkInterfaces()['Loopback Pseudo-Interface 1'][1].address;

    const tracking = `User: ${username} user ip: ${IPAddress} checking time: ${date} checked page: ${pageUrl} ~\n`;
    // fs.appendFile('first.txt', 'content goes here', (err) => {
    //     if(err){
    //         console.log(err);
    //     } console.log('SAVED');
    // });

    fs.appendFile('track.user.activity.txt ', tracking, (err) => {
        if(err){
            console.log(err);
        } console.log('SAVED');
    });

}).listen(port, () => {
    console.log('Server is running on port ', port);
})

