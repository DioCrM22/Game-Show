--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-07-22 21:16:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4942 (class 1262 OID 32999)
-- Name: gameshow; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE gameshow WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Portuguese_Brazil.1252';


ALTER DATABASE gameshow OWNER TO postgres;

\connect gameshow

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 33357)
-- Name: battles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.battles (
    id integer NOT NULL,
    player1_id integer NOT NULL,
    player2_id integer NOT NULL,
    vencedor_id integer NOT NULL,
    player1_heroi character varying(255) NOT NULL,
    player2_heroi character varying(255) NOT NULL,
    rounds integer DEFAULT 0,
    dano_total integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.battles OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 33283)
-- Name: battles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.battles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.battles_id_seq OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 33356)
-- Name: battles_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.battles_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.battles_id_seq1 OWNER TO postgres;

--
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 224
-- Name: battles_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.battles_id_seq1 OWNED BY public.battles.id;


--
-- TOC entry 221 (class 1259 OID 33317)
-- Name: heroes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.heroes (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    gif_entrada character varying(255) DEFAULT '/gifs/default/entrada.gif'::character varying NOT NULL,
    gif_ataque_especial character varying(255) DEFAULT '/gifs/default/especial.gif'::character varying NOT NULL,
    vida_base integer DEFAULT 100 NOT NULL,
    defesa integer DEFAULT 10 NOT NULL,
    velocidade integer DEFAULT 50 NOT NULL,
    ataque_especial_nome character varying(255) DEFAULT 'Super Ataque'::character varying NOT NULL,
    ataque_especial_dano integer DEFAULT 30 NOT NULL,
    ataque_especial_precisao integer DEFAULT 60 NOT NULL,
    gif_saida character varying(255) DEFAULT '/gifs/default/saida.gif'::character varying NOT NULL,
    imagem_url character varying(255) DEFAULT '/images/default-hero.jpg'::character varying,
    ataque_basico_nome character varying(255) DEFAULT 'Ataque Básico'::character varying,
    ataque_basico_dano integer DEFAULT 20,
    ataque_basico_precisao integer DEFAULT 80,
    ataque_rapido_nome character varying(255) DEFAULT 'Ataque Rápido'::character varying,
    ataque_rapido_dano integer DEFAULT 15,
    ataque_rapido_precisao integer DEFAULT 90
);


ALTER TABLE public.heroes OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 33245)
-- Name: heroes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.heroes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.heroes_id_seq OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 33316)
-- Name: heroes_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.heroes_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.heroes_id_seq1 OWNER TO postgres;

--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 220
-- Name: heroes_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.heroes_id_seq1 OWNED BY public.heroes.id;


--
-- TOC entry 223 (class 1259 OID 33343)
-- Name: players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.players (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    heroi_id integer,
    vitorias integer DEFAULT 0,
    derrotas integer DEFAULT 0
);


ALTER TABLE public.players OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 33269)
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.players_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.players_id_seq OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 33342)
-- Name: players_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.players_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.players_id_seq1 OWNER TO postgres;

--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 222
-- Name: players_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.players_id_seq1 OWNED BY public.players.id;


--
-- TOC entry 4674 (class 2604 OID 33360)
-- Name: battles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.battles ALTER COLUMN id SET DEFAULT nextval('public.battles_id_seq1'::regclass);


--
-- TOC entry 4654 (class 2604 OID 33320)
-- Name: heroes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes ALTER COLUMN id SET DEFAULT nextval('public.heroes_id_seq1'::regclass);


--
-- TOC entry 4671 (class 2604 OID 33346)
-- Name: players id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq1'::regclass);


--
-- TOC entry 4936 (class 0 OID 33357)
-- Dependencies: 225
-- Data for Name: battles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.battles (id, player1_id, player2_id, vencedor_id, player1_heroi, player2_heroi, rounds, dano_total, "createdAt") FROM stdin;
1	1	2	1	Batman	Coringa	3	150	2025-07-09 23:00:28.332-03
2	2	1	2	Coringa	Batman	5	200	2025-07-09 23:00:28.332-03
\.


--
-- TOC entry 4932 (class 0 OID 33317)
-- Dependencies: 221
-- Data for Name: heroes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.heroes (id, nome, gif_entrada, gif_ataque_especial, vida_base, defesa, velocidade, ataque_especial_nome, ataque_especial_dano, ataque_especial_precisao, gif_saida, imagem_url, ataque_basico_nome, ataque_basico_dano, ataque_basico_precisao, ataque_rapido_nome, ataque_rapido_dano, ataque_rapido_precisao) FROM stdin;
1	Batman	/gifs/entrada/batman.gif	/gifs/ataque/batman.gif	100	30	45	Chuva de Morcegos	60	90	/gifs/saida/batman.gif	/images/batman.jpg	Ataque Básico	20	80	Ataque Rápido	15	90
2	Coringa	/gifs/entrada/coringa.gif	/gifs/ataque/coringa.gif	95	25	50	Riso insano	65	85	/gifs/saida/coringa.gif	/images/coringa.jpg	Ataque Básico	20	80	Ataque Rápido	15	90
\.


--
-- TOC entry 4934 (class 0 OID 33343)
-- Dependencies: 223
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.players (id, nome, heroi_id, vitorias, derrotas) FROM stdin;
1	Diogo	1	5	2
2	Maria	2	3	4
0	CPU	1	0	0
3	oi	2	0	0
4	oi	1	0	0
5	oi	2	0	0
6	ola	1	0	0
7	oi	1	0	0
8	po	1	0	0
9	ty	1	0	0
10	ty	1	0	0
11	oi	2	0	0
12	oi	1	0	0
13	oi	2	0	0
14	oi	1	0	0
15	oi	1	0	0
16	oi	1	0	0
17	oi	1	0	0
18	oi	2	0	0
19	oi	2	0	0
20	oi	1	0	0
21	oi	1	0	0
22	oi	1	0	0
23	gui	1	0	0
24	oi	2	0	0
25	oi	2	0	0
26	oi	2	0	0
27	gui	1	0	0
28	oi	2	0	0
29	oi	1	0	0
30	oi	1	0	0
31	oi	2	0	0
32	oi	1	0	0
33	oi	1	0	0
34	oi	1	0	0
35	oi	1	0	0
36	oi	1	0	0
37	oi	1	0	0
38	oi	1	0	0
39	oi	1	0	0
40	oi	2	0	0
41	oi	1	0	0
42	oi	2	0	0
43	gui	1	0	0
44	oi	2	0	0
45	tu	1	0	0
46	oi	1	0	0
47	gui	1	0	0
48	oi	1	0	0
49	oi	\N	0	0
50	oi	\N	0	0
51	ele2	\N	0	0
52	oi	1	0	0
53	oi	\N	0	0
54	oi	\N	0	0
55	oi	\N	0	0
56	oi	\N	0	0
57	oi	\N	0	0
58	oi	\N	0	0
59	oi	\N	0	0
60	oi	\N	0	0
61	oi	\N	0	0
62	oi	\N	0	0
63	ele	\N	0	0
64	gui	\N	0	0
65	oi	\N	0	0
66	oi	\N	0	0
67	oi	\N	0	0
68	oi	\N	0	0
69	oi	\N	0	0
70	oi	\N	0	0
71	tu	\N	0	0
72	oi	\N	0	0
73	oi	\N	0	0
74	oi	\N	0	0
75	ele2	\N	0	0
76	gui	\N	0	0
77	oi	\N	0	0
78	oi	\N	0	0
79	ele2	\N	0	0
80	oi	\N	0	0
81	gui	\N	0	0
82	oi	\N	0	0
83	oi	\N	0	0
84	oi	\N	0	0
85	oi	\N	0	0
86	ele2	\N	0	0
87	oi	\N	0	0
88	oi	\N	0	0
89	oi	\N	0	0
90	oi	\N	0	0
91	oi	\N	0	0
92	ele2	\N	0	0
93	oi	\N	0	0
94	gui	\N	0	0
95	oi	\N	0	0
96	oi	\N	0	0
97	gui	\N	0	0
98	ele2	\N	0	0
99	oi	\N	0	0
100	ele2	\N	0	0
101	oi	\N	0	0
102	ele2	\N	0	0
103	gui	\N	0	0
104	ele2	\N	0	0
105	gui	\N	0	0
106	gui	\N	0	0
107	gui	\N	0	0
108	oi	\N	0	0
109	oi	\N	0	0
110	oi	\N	0	0
111	oi	\N	0	0
112	ele2	\N	0	0
113	oi	\N	0	0
114	oi	\N	0	0
115	oi	\N	0	0
116	gui	\N	0	0
117	ele2	\N	0	0
118	oi	\N	0	0
119	gui	\N	0	0
120	ele2	\N	0	0
\.


--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 219
-- Name: battles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.battles_id_seq', 1, false);


--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 224
-- Name: battles_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.battles_id_seq1', 2, true);


--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 217
-- Name: heroes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.heroes_id_seq', 1, false);


--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 220
-- Name: heroes_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.heroes_id_seq1', 2, true);


--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 218
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.players_id_seq', 1, false);


--
-- TOC entry 4951 (class 0 OID 0)
-- Dependencies: 222
-- Name: players_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.players_id_seq1', 120, true);


--
-- TOC entry 4778 (class 2606 OID 33366)
-- Name: battles battles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.battles
    ADD CONSTRAINT battles_pkey PRIMARY KEY (id);


--
-- TOC entry 4678 (class 2606 OID 43952)
-- Name: heroes heroes_nome_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key UNIQUE (nome);


--
-- TOC entry 4680 (class 2606 OID 43954)
-- Name: heroes heroes_nome_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key1 UNIQUE (nome);


--
-- TOC entry 4682 (class 2606 OID 43966)
-- Name: heroes heroes_nome_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key10 UNIQUE (nome);


--
-- TOC entry 4684 (class 2606 OID 43968)
-- Name: heroes heroes_nome_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key11 UNIQUE (nome);


--
-- TOC entry 4686 (class 2606 OID 43888)
-- Name: heroes heroes_nome_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key12 UNIQUE (nome);


--
-- TOC entry 4688 (class 2606 OID 43890)
-- Name: heroes heroes_nome_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key13 UNIQUE (nome);


--
-- TOC entry 4690 (class 2606 OID 43944)
-- Name: heroes heroes_nome_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key14 UNIQUE (nome);


--
-- TOC entry 4692 (class 2606 OID 43892)
-- Name: heroes heroes_nome_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key15 UNIQUE (nome);


--
-- TOC entry 4694 (class 2606 OID 43928)
-- Name: heroes heroes_nome_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key16 UNIQUE (nome);


--
-- TOC entry 4696 (class 2606 OID 43924)
-- Name: heroes heroes_nome_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key17 UNIQUE (nome);


--
-- TOC entry 4698 (class 2606 OID 43926)
-- Name: heroes heroes_nome_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key18 UNIQUE (nome);


--
-- TOC entry 4700 (class 2606 OID 43922)
-- Name: heroes heroes_nome_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key19 UNIQUE (nome);


--
-- TOC entry 4702 (class 2606 OID 43956)
-- Name: heroes heroes_nome_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key2 UNIQUE (nome);


--
-- TOC entry 4704 (class 2606 OID 43894)
-- Name: heroes heroes_nome_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key20 UNIQUE (nome);


--
-- TOC entry 4706 (class 2606 OID 43902)
-- Name: heroes heroes_nome_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key21 UNIQUE (nome);


--
-- TOC entry 4708 (class 2606 OID 43904)
-- Name: heroes heroes_nome_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key22 UNIQUE (nome);


--
-- TOC entry 4710 (class 2606 OID 43906)
-- Name: heroes heroes_nome_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key23 UNIQUE (nome);


--
-- TOC entry 4712 (class 2606 OID 43920)
-- Name: heroes heroes_nome_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key24 UNIQUE (nome);


--
-- TOC entry 4714 (class 2606 OID 43908)
-- Name: heroes heroes_nome_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key25 UNIQUE (nome);


--
-- TOC entry 4716 (class 2606 OID 43918)
-- Name: heroes heroes_nome_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key26 UNIQUE (nome);


--
-- TOC entry 4718 (class 2606 OID 43910)
-- Name: heroes heroes_nome_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key27 UNIQUE (nome);


--
-- TOC entry 4720 (class 2606 OID 43916)
-- Name: heroes heroes_nome_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key28 UNIQUE (nome);


--
-- TOC entry 4722 (class 2606 OID 43912)
-- Name: heroes heroes_nome_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key29 UNIQUE (nome);


--
-- TOC entry 4724 (class 2606 OID 43950)
-- Name: heroes heroes_nome_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key3 UNIQUE (nome);


--
-- TOC entry 4726 (class 2606 OID 43914)
-- Name: heroes heroes_nome_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key30 UNIQUE (nome);


--
-- TOC entry 4728 (class 2606 OID 43970)
-- Name: heroes heroes_nome_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key31 UNIQUE (nome);


--
-- TOC entry 4730 (class 2606 OID 43886)
-- Name: heroes heroes_nome_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key32 UNIQUE (nome);


--
-- TOC entry 4732 (class 2606 OID 43880)
-- Name: heroes heroes_nome_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key33 UNIQUE (nome);


--
-- TOC entry 4734 (class 2606 OID 43882)
-- Name: heroes heroes_nome_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key34 UNIQUE (nome);


--
-- TOC entry 4736 (class 2606 OID 43884)
-- Name: heroes heroes_nome_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key35 UNIQUE (nome);


--
-- TOC entry 4738 (class 2606 OID 43878)
-- Name: heroes heroes_nome_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key36 UNIQUE (nome);


--
-- TOC entry 4740 (class 2606 OID 43900)
-- Name: heroes heroes_nome_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key37 UNIQUE (nome);


--
-- TOC entry 4742 (class 2606 OID 43896)
-- Name: heroes heroes_nome_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key38 UNIQUE (nome);


--
-- TOC entry 4744 (class 2606 OID 43898)
-- Name: heroes heroes_nome_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key39 UNIQUE (nome);


--
-- TOC entry 4746 (class 2606 OID 43958)
-- Name: heroes heroes_nome_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key4 UNIQUE (nome);


--
-- TOC entry 4748 (class 2606 OID 43942)
-- Name: heroes heroes_nome_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key40 UNIQUE (nome);


--
-- TOC entry 4750 (class 2606 OID 43930)
-- Name: heroes heroes_nome_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key41 UNIQUE (nome);


--
-- TOC entry 4752 (class 2606 OID 43932)
-- Name: heroes heroes_nome_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key42 UNIQUE (nome);


--
-- TOC entry 4754 (class 2606 OID 43940)
-- Name: heroes heroes_nome_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key43 UNIQUE (nome);


--
-- TOC entry 4756 (class 2606 OID 43934)
-- Name: heroes heroes_nome_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key44 UNIQUE (nome);


--
-- TOC entry 4758 (class 2606 OID 43936)
-- Name: heroes heroes_nome_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key45 UNIQUE (nome);


--
-- TOC entry 4760 (class 2606 OID 43938)
-- Name: heroes heroes_nome_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key46 UNIQUE (nome);


--
-- TOC entry 4762 (class 2606 OID 43876)
-- Name: heroes heroes_nome_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key47 UNIQUE (nome);


--
-- TOC entry 4764 (class 2606 OID 43960)
-- Name: heroes heroes_nome_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key5 UNIQUE (nome);


--
-- TOC entry 4766 (class 2606 OID 43962)
-- Name: heroes heroes_nome_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key6 UNIQUE (nome);


--
-- TOC entry 4768 (class 2606 OID 43964)
-- Name: heroes heroes_nome_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key7 UNIQUE (nome);


--
-- TOC entry 4770 (class 2606 OID 43948)
-- Name: heroes heroes_nome_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key8 UNIQUE (nome);


--
-- TOC entry 4772 (class 2606 OID 43946)
-- Name: heroes heroes_nome_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_nome_key9 UNIQUE (nome);


--
-- TOC entry 4774 (class 2606 OID 33341)
-- Name: heroes heroes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heroes
    ADD CONSTRAINT heroes_pkey PRIMARY KEY (id);


--
-- TOC entry 4776 (class 2606 OID 33350)
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- TOC entry 4780 (class 2606 OID 44012)
-- Name: battles battles_player1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.battles
    ADD CONSTRAINT battles_player1_id_fkey FOREIGN KEY (player1_id) REFERENCES public.players(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4781 (class 2606 OID 44017)
-- Name: battles battles_player2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.battles
    ADD CONSTRAINT battles_player2_id_fkey FOREIGN KEY (player2_id) REFERENCES public.players(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4782 (class 2606 OID 44022)
-- Name: battles battles_vencedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.battles
    ADD CONSTRAINT battles_vencedor_id_fkey FOREIGN KEY (vencedor_id) REFERENCES public.players(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4779 (class 2606 OID 44003)
-- Name: players players_heroi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_heroi_id_fkey FOREIGN KEY (heroi_id) REFERENCES public.heroes(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2025-07-22 21:16:05

--
-- PostgreSQL database dump complete
--

