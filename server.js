const express = require('express')
const { rmSync } = require('fs')
const path = require('path')
const { nextTick } = require('process')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'assets')))
app.set('views', path.join(__dirname, 'assets'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.render('login.html')

})


var pautasToClient = []



var estadoCheck = []

var inputsOradoresServer = [
    {
        nome: 'Luis Henrique Gonçalves',
        orgao: 'Procurador e Consultor Jurídico',
        funcao: 'Câmara Municipal'
    },
    {
        nome: 'Júlia Lemos Cambraia',
        orgao: 'Procuradora e Consultora Jurídica',
        funcao: 'Câmara Municipal'
    },
    {
        nome: 'João Batista Gonçalves (Cabo Batista)',
        orgao: 'cabobatista@camarapatos.mg.gov.br',
        funcao: 'Vereador Presidente (PP)'
    },
    {
        nome: 'Mauri Sérgio Rodrigues (Mauri da JL)',
        orgao: 'mauridajl@camarapatos.mg.gov.br',
        funcao: 'Vereador 1º Vice-Presidente (PL)'
    },
    {
        nome: 'Paulo Augusto Corrêa (Paulinho)',
        orgao: 'paulinho@camarapatos.mg.gov.br',
        funcao: 'Vereador 2º Vice-Presidente (PODEMOS)'
    },
    {
        nome: 'Ezequiel Macedo Galvão (Ezequiel Macedo)',
        orgao: 'ezequielmacedo@camarapatos.mg.gov.br',
        funcao: 'Vereador 1º Secretário (PP)'
    },
    {
        nome: 'Brenda Évellyn Santos (Brenda Évellyn)',
        orgao: 'brendaevellyn@camarapatos.mg.gov.br',
        funcao: 'Vereadora 2ª Secretária (NOVO)'
    },
]

var reuniaoInputsServer = []

pautaSelecionada = null

vereadores = [
    {
        nome: 'Antônio Jorge de Oliveira Cury (Toninho Cury)',
        sigla: 'UNIÃO BRASIL',
        email: 'toninhocury@camarapatos.mg.gov.br',
    },
    {
        nome: 'Brenda Evellyn Santos',
        sigla: 'NOVO',
        email: 'brendaevellyn@camarapatos.mg.gov.br',
        funcao: "teste"
    },
    {
        nome: 'Elizabeth Maria Nascimento e Silva (Profa. Beth)',
        sigla: 'PODE',
        email: 'profbeth@camarapatos.mg.gov.br',
    },
    {
        nome: 'Ezequiel Macedo Galvão',
        sigla: 'PP',
        email: 'ezequielmacedo@camarapatos.mg.gov.br',
    },
    {
        nome: 'Gladston Gabriel da Silva',
        sigla: 'PL',
        email: 'gladston@camarapatos.mg.gov.br',
    },
    {
        nome: "Itamar André dos Santos",
        sigla: 'PP',
        email: 'itamarandre@camarapatos.mg.gov.br',
    },
    {
        nome: 'João Batista Gonçalves (Cabo Batista)',
        sigla: 'PP',
        email: 'cabobatista@camarapatos.mg.gov.br',
    },
    {
        nome: 'José Carlos da Silva (Carlito)',
        sigla: 'PP',
        email: 'carlito@camarapatos.mg.gov.br '
    },
    {
        nome: 'José Eustáquio de Faria Junior',
        sigla: 'MDB',
        email: 'joseeustaquio@camarapatos.mg.gov.br'
    },
    {
        nome: 'José Luiz Borges Júnior (Zé Luiz)',
        sigla: 'PODE',
        email: 'joseluiz@camarapatos.mg.gov.br'
    },
    {
        nome: 'Júlio Cesar Gonçalves (Branco)',
        sigla: 'REPUBLICANOS',
        email: 'juliocesar@camarapatos.mg.gov.br'
    },
    {
        nome: 'Leomar de Lima Silva (Sargento Leomar)',
        sigla: 'PRD',
        email: 'sargentoleomar@camarapatos.mg.gov.br'
    },
    {
        nome: 'Mauri Sérgio Rodrigues (Mauri da JL)',
        sigla: 'PL',
        email: 'mauridajl@camarapatos.mg.gov.br '
    },
    {
        nome: 'Otaviano Marques de Amorim (Otaviano Marques)',
        sigla: 'UNIÃO BRASIL',
        email: 'otavianomarques@camarapatos.mg.gov.br '
    },
    {
        nome: 'Paulo Augusto Corrêa (Paulinho)',
        sigla: 'PODE',
        email: 'paulinho@camarapatos.mg.gov.br'
    },
    {
        nome: 'Paulo Henrique Fernandes Caixeta',
        sigla: 'NOVO',
        email: 'paulohenrique@camarapatos.mg.gov.br'
    },
    {
        nome: 'Wilian de Campos',
        sigla: 'MDB',
        email: 'wiliancampos@camarapatos.mg.gov.br'
    }
]

statusVer = []

io.on('connection', socket => {



    //console.log((socket.handshake.headers.cookie.split(';'))[0].replace('=',''))
    socket.emit('socket-id-to-client', socketToClient = socket.id)

    socket.on('socket-id-to-server', socketIdToServer => {
        try {
            statusVer.find(ver => ver.id == socketIdToServer.id) === undefined ? statusVer.push(socketIdToServer) : statusVer.find(ver => ver.id == socketIdToServer.id).socket = socketIdToServer.socket

            socket.broadcast.emit('online-to-client', cookieToServer = statusVer[statusVer.length - 1].id)
        } catch (error) {

        }
    })

    //socket.on('disconnect', () => {
    //    try {
    //        socket.broadcast.emit('ausencia-to-client', idToServer = statusVer.find(ver => ver.socket == socket.id).id)
    //        statusVer.splice(statusVer.indexOf(statusVer.find(ver => ver.socket == socket.id)), 1)
    //    } catch (error) {
    //
    //       }

    //  })

    socket.on('salvar', function () {
        socket.broadcast.emit('ocultar')
    })

    socket.on('vereador', vereador => {
        socket.broadcast.emit('lower-third-vereador', vereador)
    })

    socket.on('cronometro-to-server', cronometro => {
        socket.broadcast.emit('cronometro-to-client', cronometro)
    })

    socket.on('pautas-to-server', pautasToServer => {
        pautasToClient = pautasToServer
        socket.broadcast.emit('pautas-to-client', pautasToClient)
    })
    socket.emit('pautas-to-client', pautasToClient)

    socket.emit('input-vereadores', vereadores)

    socket.on('check-to-server', estadoChecks => {
        estadoCheck = estadoChecks
    })
    socket.emit('check-to-client', estadoCheck)

    socket.on('resposta-to-server', resposta => {
        socket.broadcast.emit('resposta-to-client', resposta)
    })





    socket.on('oradores-to-server', inputsOradores => {
        inputsOradoresServer = inputsOradores
    })
    socket.emit('oradores-to-client', inputsOradoresServer)

    socket.on('orador-to-server', orador => {
        socket.broadcast.emit('orador-to-client', orador)
    })

    socket.on('titulo-to-server', titulo => {
        socket.broadcast.emit('titulo-to-client', titulo)
    })

    socket.on('subtitulo-to-server', subtitulo => {
        socket.broadcast.emit('subtitulo-to-client', subtitulo)
    })

    socket.on('reuniao-inputs-to-server', reuniaoInputs => {
        reuniaoInputsServer = reuniaoInputs
    })
    socket.emit('reuniao-inputs-to-client', reuniaoInputsServer)


    socket.on('painel-to-server', painel => {

        pautaSelecionada = painel

        socket.broadcast.emit('painel-to-client', painel)
        painelToClient = painel
    })
    try {
        socket.emit('painel-to-client', painelToClient)
    } catch (error) {

    }

    pautaSelecionada != null ? socket.emit('pauta-selecionada-to-client', pautaSelecionada) : undefined


    socket.on('teste-fpjs', fpjs => {
        console.log(`${fpjs.id}: ${fpjs.visitor}`)
    })

    socket.on('voto-presidente-to-server', voto => {
        socket.broadcast.emit('voto-presidente-to-client', voto)
    })

})




server.listen(80)

