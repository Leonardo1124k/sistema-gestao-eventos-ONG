backend/
├── pom.xml                   <-- (1) O "Contrato" do Projeto (Dependências)
├── mvnw e mvnw.cmd           <-- Scripts do Maven (não mexa)
├── .gitignore                <-- Específico do Java (opcional, se já tiver na raiz)
│
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/
    │   │       └── moradiadigna/
    │   │           └── api/   <-- (2) Onde seu código Java vive
    │   │               ├── MoradiaDignaApplication.java  <-- Arquivo Principal (Main)
    │   │               │
    │   │               ├── controller/       <-- (3) Os "Garçons" (Recebem pedidos do Site)
    │   │               │   ├── EventoController.java
    │   │               │   ├── TalharimController.java
    │   │               │   └── BazarController.java
    │   │               │
    │   │               ├── model/            <-- (4) As Tabelas (Entidades)
    │   │               │   ├── Evento.java
    │   │               │   ├── Usuario.java
    │   │               │   ├── ReservaTalharim.java
    │   │               │   └── DoacaoBazar.java
    │   │               │
    │   │               ├── repository/       <-- (5) O Acesso ao Banco (SQL automático)
    │   │               │   ├── EventoRepository.java
    │   │               │   ├── UsuarioRepository.java
    │   │               │   ├── ReservaTalharimRepository.java
    │   │               │   └── DoacaoBazarRepository.java
    │   │               │
    │   │               └── service/          <-- (6) A Lógica de Negócio (Onde a mágica acontece)
    │   │                   ├── TalharimService.java
    │   │                   └── BazarService.java
    │   │
    │   └── resources/
    │       ├── application.properties    <-- (7) Configuração do Banco de Dados
    │       ├── static/                   (Vazio, pois seu front está separado)
    │       └── templates/                (Vazio, pois seu front está separado)
    │
    └── test/                         <-- (8) Testes Automatizados (Pode deixar para o final)