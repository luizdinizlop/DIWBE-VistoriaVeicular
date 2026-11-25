
create database if not exists vistoria;
use vistoria;

--Usuários(operador ou avaliador)
create table usuario
(
   id bigint not null auto_increment,
   nome varchar(255),
   email varchar(255) unique,
   senha varchar(255),
   tipo varchar(20),     
   primary key(id)
);

-- Vistorias
create table vistoria
(
   id bigint not null auto_increment,
   placa varchar(10),
   modelo varchar(255),
   data_hora datetime,
   avaliador_id bigint,
   motivo varchar(255),
   endereco varchar(255),
   situacao varchar(30) default 'Pendente', 
   primary key(id),
   foreign key (avaliador_id) references usuario(id)
);

Fotos 
create table foto
(
   id bigint not null auto_increment,
   vistoria_id bigint,
   posicao varchar(50),         
   imagem longtext,             
   primary key(id),
   foreign key (vistoria_id) references vistoria(id) on delete cascade
);

-- Características(avarias, observações)
create table caracteristica
(
   id bigint not null auto_increment,
   vistoria_id bigint,
   descricao varchar(255),
   primary key(id),
   foreign key (vistoria_id) references vistoria(id) on delete cascade
);

-- dados inseridos para exemplo
insert into usuario (nome, email, senha, tipo) values
('Ana Operadora',   'operador@vistoria.com',  '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'operador'),
('Carlos Avaliador','avaliador@vistoria.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'avaliador'),
('Bruna Avaliadora','bruna@vistoria.com',     '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'avaliador');

-- As datas são relativas ao dia de hoje para a demonstração funcionar sempre
insert into vistoria (placa, modelo, data_hora, avaliador_id, motivo, endereco, situacao) values
('CER-9E99', 'LAMBORGHINI/URUS',       now() - interval 20 day, 2, 'Transferência', 'Av. Paulista, 1000 - São Paulo/SP', 'Aprovado'),
('RDN-1J99', 'VOLKSWAGEN/GOL 1.0 16V', now() - interval 15 day, 3, 'Seguro',        'Rua das Flores, 25 - Campinas/SP',  'Cancelado'),
('RDM-0H00', 'FIAT/UNO MILLE 1.0',     now() + interval 5 day,  2, 'Transferência', 'Rua XV de Novembro, 300 - Curitiba/PR', 'Pendente'),
('RVT-1J56', 'RENAULT/KWID ZEN 1.0',   now() - interval 10 day, 2, 'Sinistro',      'Av. Brasil, 1500 - Rio de Janeiro/RJ', 'Reprovado'),
('GTA-1911', 'CHEVROLET/ONIX JOYE',    now() + interval 3 day,  2, 'Seguro',        'Rua Augusta, 800 - São Paulo/SP',   'Pendente'),
('SNK-4S12', 'HYUNDAI/HB20S',          timestamp(curdate(), '18:00:00'), 2, 'Transferência', 'Av. Afonso Pena, 45 - Belo Horizonte/MG', 'Pendente'),
('AOB-1A01', 'FORD/KA FLEX',           now() - interval 3 day,  2, 'Seguro',        'Rua Bahia, 120 - Salvador/BA',      'Pendente'),
('HKN-9E25', 'FIAT/MAREA TURBO',       now() - interval 1 day,  3, 'Sinistro',      'Av. Beira Mar, 90 - Fortaleza/CE',  'Aprovado'),
('AON-9A06', 'FIAT/TORO FREEDOM 2.0',  now() - interval 2 day,  2, 'Transferência', 'Rua Goiás, 77 - Goiânia/GO',        'Com ressalvas');

insert into caracteristica (vistoria_id, descricao) values
(9, 'Arranhão na lat. direita'),
(9, 'Para-brisa trincado');
