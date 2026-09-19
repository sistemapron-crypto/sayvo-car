// Firebase Configuration & Initialization
const firebaseConfig = {
  apiKey: "AIzaSyBJFrMrZ7XdBpn1jJqtPz1eC2IKvcQYrrc",
  authDomain: "catalogo-modelo-3ba73.firebaseapp.com",
  projectId: "catalogo-modelo-3ba73",
  storageBucket: "catalogo-modelo-3ba73.firebasestorage.app",
  messagingSenderId: "380760744772",
  appId: "1:380760744772:web:c992400bdbcf840845ad11"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

// ── AUTENTICAÇÃO E CONTROLE DE ACESSO ──────────────────────────────────────
function fazerLogin() {
  const emailInput = document.getElementById("email-input");
  const senhaInput = document.getElementById("senha-input");
  const email = emailInput ? emailInput.value.trim() : "";
  const senha = senhaInput ? senhaInput.value : "";
  const err = document.getElementById("login-error");
  const btn = document.getElementById("btn-login");

  if (err) err.style.display = "none";

  if (!email || !senha) {
    if (err) {
      err.textContent = "Credenciais inválidas. Verifique seu e-mail e senha.";
      err.style.display = "block";
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Entrando...`;
  }

  const restaurarBtn = () => {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-arrow-right-to-bracket"></i> Acessar Painel`;
    }
  };

  // Autenticação via Firebase Auth
  auth.signInWithEmailAndPassword(email, senha)
    .then((cred) => {
      restaurarBtn();
    })
    .catch((error) => {
      console.error("Erro de autenticação:", error);

      restaurarBtn();

      if (err) {
        err.textContent =
          "Credenciais inválidas. Verifique seu e-mail e senha.";
        err.style.display = "block";
      }
    });
}

function fazerLogout() {

  auth.signOut().finally(() => {

    const loginScreen = document.getElementById("login-screen");

    const appEl = document.getElementById("app");

    if (loginScreen) loginScreen.style.display = "flex";

    if (appEl) appEl.style.display = "none";

    const err = document.getElementById("login-error");

    if (err) err.style.display = "none";

  });

}

document.getElementById("senha-input")?.addEventListener("keydown", e => {
  if (e.key === "Enter") fazerLogin();
});
document.getElementById("email-input")?.addEventListener("keydown", e => {
  if (e.key === "Enter") fazerLogin();
});

auth.onAuthStateChanged(user => {
  if (user) {
    const loginScreen = document.getElementById("login-screen");
    const appEl = document.getElementById("app");

    if (loginScreen) loginScreen.style.display = "none";
    if (appEl) appEl.style.display = "block";

    const emailExibicao = document.getElementById("topbar-usuario-email");

    if (emailExibicao) {
      emailExibicao.textContent = user.email || "Administrador";
    }

    inicializar();
  } else {
    const loginScreen = document.getElementById("login-screen");
    const appEl = document.getElementById("app");

    if (loginScreen) loginScreen.style.display = "flex";
    if (appEl) appEl.style.display = "none";
  }
});

// ── ESTADO GLOBAL ────────────────────────────────────────────────────────────
let todosProdutos = [];
let todasCategorias = [];
let todasMarcas = [];
let todosCupons = [];
let todasContasAReceber = [];
let vendasHoje = [];
let vendasRelatorio = [];
let _imagensSelecionadas = [];
let _bannerArquivoSelecionado = null;
let _bannerUrlAtual = "";
let _logoArquivoSelecionado = null;
let _logoUrlAtual = "";
let pdvCarrinho = [];
let pdvCupomAplicado = null;

const PAG_LABEL = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  debito: "Cartão Débito",
  credito: "Cartão Crédito",
  prazo: "A Prazo"
};

// ── INICIALIZAÇÃO ────────────────────────────────────────────────────────────
let _inicializando = false;
async function inicializar() {
  if (_inicializando) return;
  _inicializando = true;
  try {
    await Promise.all([
      carregarCategorias(),
      carregarMarcas(),
      carregarProdutos(),
      carregarCupons(),
      carregarConfiguracoes(),
      carregarVendasHoje(),
      carregarContasAReceber()
    ]);
    atualizarDashboard();
  } catch (e) {
    console.error("Erro ao carregar dados do Firebase:", e);
  } finally {
    _inicializando = false;
  }
}

// ── CONTROLE DO MENU LATERAL MOBILE (DRAWER) ──────────────────────────────────
function toggleMobileSidebar() {
  const sidebar = document.getElementById("main-sidebar") || document.querySelector(".sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (!sidebar) return;
  const isOpen = sidebar.classList.contains("open");
  if (isOpen) {
    fecharMobileSidebar();
  } else {
    sidebar.classList.add("open");
    document.body.classList.add("sidebar-open");
    if (backdrop) backdrop.classList.add("open");
  }
}

function fecharMobileSidebar() {
  const sidebar = document.getElementById("main-sidebar") || document.querySelector(".sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (sidebar) sidebar.classList.remove("open");
  document.body.classList.remove("sidebar-open");
  if (backdrop) backdrop.classList.remove("open");
}

// Fechar menu mobile ao pressionar tecla Escape
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    fecharMobileSidebar();
  }
});

// ── NAVEGAÇÃO ENTRE TABS ──────────────────────────────────────────────────────
function mudarTab(tab, btn) {
  fecharMobileSidebar();
  document.querySelectorAll(".side-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));

  if (btn) {
    btn.classList.add("active");
  } else {
    const targetBtn = document.querySelector(`.side-btn[data-tab="${tab}"]`);
    if (targetBtn) targetBtn.classList.add("active");
  }

  const panel = document.getElementById("tab-" + tab);
  if (panel) panel.classList.add("active");

  if (tab === "dashboard") atualizarDashboard();
  if (tab === "pdv") renderPdvGrid();
  if (tab === "relatorio") {
    const mesInput = document.getElementById("relatorio-mes");
    if (mesInput && !mesInput.value) mesInput.value = mesAtualStr();
    carregarRelatorio();
  }
  if (tab === "contas-a-receber") carregarContasAReceber();
}

function mesAtualStr() {
  const hoje = new Date();
  return hoje.getFullYear() + "-" + String(hoje.getMonth() + 1).padStart(2, "0");
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}

// ── DASHBOARD / VISÃO GERAL ──────────────────────────────────────────────────
function atualizarDashboard() {
  const elEstoqueTotal = document.getElementById("dash-estoque-total");
  const elEstoqueAtivos = document.getElementById("dash-estoque-ativos");
  const elEstoqueDestaques = document.getElementById("dash-estoque-destaques");
  const elVendasHojeQtd = document.getElementById("dash-vendas-hoje-qtd");
  const elVendasHojeTotal = document.getElementById("dash-vendas-hoje-total");
  const elFinanceiroPendente = document.getElementById("dash-financeiro-pendente");

  if (elEstoqueTotal) {
    elEstoqueTotal.textContent =
      todosProdutos.filter(p => p.ativo !== false && p.vendido !== true).length;
  }
  if (elEstoqueAtivos) elEstoqueAtivos.textContent = todosProdutos.filter(p => p.ativo !== false).length;
  if (elEstoqueDestaques) elEstoqueDestaques.textContent = todosProdutos.filter(p => p.destaque).length;

  const vendasHojeValidas = vendasHoje.filter(v => v.status !== "cancelada");
  if (elVendasHojeQtd) elVendasHojeQtd.textContent = vendasHojeValidas.length;
  const totalHoje = vendasHojeValidas.reduce((s, v) => s + Number(v.total || 0), 0);
  if (elVendasHojeTotal) elVendasHojeTotal.textContent = formatarMoeda(totalHoje);

  let totalPendente = 0;
  todasContasAReceber.forEach(conta => {
    if (conta.status === "cancelada" || conta.statusVenda === "cancelada") return;
    const orig = conta.valorOriginal || conta.totalAReceber || 0;
    const pago = conta.totalPago || 0;
    const rest = conta.saldoRestante !== undefined ? conta.saldoRestante : (orig - pago);
    if (rest > 0) totalPendente += rest;
  });
  if (elFinanceiroPendente) elFinanceiroPendente.textContent = formatarMoeda(totalPendente);

  // Recent vehicles mini table in dashboard
  const recentTable = document.getElementById("dash-recent-vehicles");
  if (recentTable) {
    const recents = todosProdutos
      .filter(p => p.ativo !== false && p.vendido !== true)
      .slice(0, 5);
    if (!recents.length) {
      recentTable.innerHTML = `<tr><td colspan="4" class="empty-state"><p>Nenhum veículo em estoque.</p></td></tr>`;
    } else {
      recentTable.innerHTML = recents.map(p => `
        <tr>
          <td>
            <div class="vehicle-cell">
              ${p.imagem ? `<img class="prod-img" src="${p.imagem}" alt="${p.nome}">` : '<div class="prod-img-placeholder"><i class="fa-solid fa-car"></i></div>'}
              <div class="vehicle-info">
                <span class="vehicle-title">${p.marca ? p.marca + ' ' : ''}${p.modelo || p.nome}</span>
                <span class="vehicle-subtitle">${p.versao || p.categoria || ''}</span>
              </div>
            </div>
          </td>
          <td>${p.anoModelo ? `${p.anoFabricacao || p.anoModelo}/${p.anoModelo}` : '–'}</td>
          <td style="font-weight:700;color:var(--text-main);">${formatarMoeda(p.preco)}</td>
          <td>${p.ativo !== false ? '<span class="badge badge-ativo">Ativo</span>' : '<span class="badge badge-inativo">Inativo</span>'}</td>
        </tr>
      `).join("");
    }
  }
}

// ── VEÍCULOS / PRODUTOS ──────────────────────────────────────────────────────
async function carregarProdutos() {
  try {
    const snap = await db.collection("produtos").orderBy("id").get();
    todosProdutos = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    atualizarStats();
    filtrar();
    popularSelectCategorias();
    popularSelectMarcas();
    renderPdvGrid();
  } catch (e) {
    toast("Erro ao carregar veículos: " + e.message, "err");
  }
}

function atualizarStats() {
  const elTotal = document.getElementById("stat-total");
  const elAtivos = document.getElementById("stat-ativos");
  const elDestaque = document.getElementById("stat-destaque");
  const elCats = document.getElementById("stat-cats");
  const elTopCount = document.getElementById("topbar-count");

  if (elTotal) elTotal.textContent = todosProdutos.length;
  if (elAtivos) elAtivos.textContent = todosProdutos.filter(p => p.ativo !== false).length;
  if (elDestaque) elDestaque.textContent = todosProdutos.filter(p => p.destaque).length;
  if (elCats) elCats.textContent = todasCategorias.length;
  if (elTopCount) {
    const totalPatio = todosProdutos.filter(
      p => p.ativo !== false && p.vendido !== true
    ).length;

    elTopCount.textContent = `${totalPatio} veículos em estoque`;
    elTopCount.setAttribute("data-count", totalPatio);
  }
}

function filtrar() {
  const busca = (document.getElementById("busca-input")?.value || "").toLowerCase();
  const cat = document.getElementById("filtro-cat")?.value;
  const status = document.getElementById("filtro-status")?.value;

  let lista = [...todosProdutos];
  if (busca) {
    lista = lista.filter(p =>
      (p.nome || "").toLowerCase().includes(busca) ||
      (p.marca || "").toLowerCase().includes(busca) ||
      (p.modelo || "").toLowerCase().includes(busca) ||
      (p.versao || "").toLowerCase().includes(busca) ||
      (p.descricao || "").toLowerCase().includes(busca)
    );
  }
  if (cat) lista = lista.filter(p => (p.categoria || "") === cat);
  if (status === "ativo") {
    lista = lista.filter(p => p.ativo !== false && p.vendido !== true);
  }

  if (status === "inativo") {
    lista = lista.filter(p => p.ativo === false && p.vendido !== true);
  }

  if (status === "vendido") {
    lista = lista.filter(p => p.vendido === true);
  }

  if (status === "destaque") {
    lista = lista.filter(p => p.destaque && p.vendido !== true);
  }
  mostrarTabela(lista);
}

function mostrarTabela(lista) {
  const tbody = document.getElementById("tabela-corpo");
  if (!tbody) return;

  if (!lista.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-car-side"></i><p>Nenhum veículo encontrado.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map(p => {
    const titulo = p.marca ? `${p.marca} ${p.modelo || p.nome}` : p.nome;
    const anoStr = p.anoFabricacao || p.anoModelo ? `${p.anoFabricacao || ''}${p.anoModelo ? '/' + p.anoModelo : ''}` : '–';
    const kmStr = p.km ? `${Number(p.km).toLocaleString('pt-BR')} km` : '–';
    const especs = [anoStr, kmStr, p.cambio, p.combustivel].filter(Boolean).join(" • ");

    return `
    <tr>
      <td>
        <div class="vehicle-cell">
          ${p.imagem ? `<img class="prod-img" src="${p.imagem}" alt="${p.nome}" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex';">` : ""}
          <div class="prod-img-placeholder" ${p.imagem ? "style='display:none'" : ""}><i class="fa-solid fa-car"></i></div>
          <div class="vehicle-info">
            <span class="vehicle-title">${titulo}</span>
            <span class="vehicle-subtitle">${p.versao || ''}</span>
          </div>
        </div>
      </td>
      <td style="color:var(--text-muted);font-size:0.82rem;font-weight:600;">#${p.id || p.docId.substring(0, 6)}</td>
      <td>
        <span class="badge" style="background:#f1f5f9;color:#334155;">${p.categoria || 'Geral'}</span>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">${especs}</div>
      </td>
      <td style="font-weight:800;color:var(--text-main);font-size:1rem;">${formatarMoeda(p.preco)}</td>
      <td>
        ${p.vendido === true
        ? '<span class="badge badge-inativo"><i class="fa-solid fa-check-double"></i> Vendido</span>'
        : p.ativo !== false
          ? '<span class="badge badge-ativo"><i class="fa-solid fa-check"></i> Ativo</span>'
          : '<span class="badge badge-inativo"><i class="fa-solid fa-xmark"></i> Inativo</span>'
      }
        ${p.destaque ? ' <span class="badge badge-destaque"><i class="fa-solid fa-star"></i> Destaque</span>' : ''}
      </td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-ghost btn-sm" onclick="abrirModalEditar('${p.docId}')" title="Editar veículo"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-danger btn-sm" onclick="confirmarExclusao('produto','${p.docId}','${(p.nome || '').replace(/'/g, "\\'")}')" title="Excluir veículo"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join("");
}

function popularSelectCategorias() {
  const selFiltro = document.getElementById("filtro-cat");
  const selForm = document.getElementById("form-categoria");
  if (!selFiltro && !selForm) return;

  const cats = [...new Set([...todasCategorias.map(c => c.id), ...todosProdutos.map(p => p.categoria).filter(Boolean)])];

  if (selFiltro) {
    selFiltro.innerHTML = `<option value="">Todas categorias</option>` + cats.map(c => {
      const nome = todasCategorias.find(x => x.id === c)?.nome || c;
      return `<option value="${c}">${nome}</option>`;
    }).join("");
  }

  if (selForm) {
    selForm.innerHTML = `<option value="">Selecione a categoria...</option>` + cats.filter(c => c !== "all").map(c => {
      const nome = todasCategorias.find(x => x.id === c)?.nome || c;
      return `<option value="${c}">${nome}</option>`;
    }).join("");
  }
}

function popularSelectMarcas() {
  const selForm = document.getElementById("form-marca");
  if (!selForm) return;

  const marcas = [...new Set([...todasMarcas.map(m => m.nome || m.id), ...todosProdutos.map(p => p.marca).filter(Boolean)])];

  selForm.innerHTML = `<option value="">Selecione uma marca...</option>` + marcas.map(m => {
    return `<option value="${m}">${m}</option>`;
  }).join("");
}

// ── UPLOAD E GALERIA DE IMAGENS ──────────────────────────────────────────────
function alternarAbaImagem(aba) {
  const urlArea = document.getElementById("img-url-area");
  const uploadArea = document.getElementById("img-upload-area");
  const tabUrl = document.getElementById("tab-url");
  const tabUpload = document.getElementById("tab-upload");

  if (urlArea) urlArea.style.display = aba === "url" ? "block" : "none";
  if (uploadArea) uploadArea.style.display = aba === "upload" ? "block" : "none";

  if (tabUrl) tabUrl.className = "btn btn-sm " + (aba === "url" ? "btn-primary" : "btn-ghost");
  if (tabUpload) tabUpload.className = "btn btn-sm " + (aba === "upload" ? "btn-primary" : "btn-ghost");
}

function adicionarImagemGaleria(src, nome = "Imagem") {
  if (!src) return;
  _imagensSelecionadas.push({ src, nome });
  renderizarGaleriaImagens();
}

function removerImagemGaleria(index) {
  _imagensSelecionadas.splice(index, 1);
  renderizarGaleriaImagens();
}

function renderizarGaleriaImagens() {
  const lista = document.getElementById("upload-preview-list");
  if (!lista) return;

  lista.innerHTML = "";
  _imagensSelecionadas.forEach((imagem, index) => {
    const item = document.createElement("div");
    item.className = "upload-gallery-item";
    item.innerHTML = `
      <img src="${imagem.src}" alt="${imagem.nome}">
      <button type="button" class="upload-gallery-remove" onclick="removerImagemGaleria(${index})" title="Remover imagem">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;
    lista.appendChild(item);
  });
}

function resetarUpload() {
  _imagensSelecionadas = [];
  alternarAbaImagem("url");

  const fileInput = document.getElementById("form-imagem-file");
  if (fileInput) fileInput.value = "";

  const previewList = document.getElementById("upload-preview-list");
  if (previewList) previewList.innerHTML = "";

  const imagemUrl = document.getElementById("form-imagem");
  if (imagemUrl) imagemUrl.value = "";
}

document.getElementById("form-imagem-file")?.addEventListener("change", (e) => {
  const arquivos = Array.from(e.target.files || []);
  if (!arquivos.length) return;

  arquivos.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      _imagensSelecionadas.push({
        src: ev.target.result,
        nome: file.name,
        file: file
      });
      renderizarGaleriaImagens();
    };
    reader.readAsDataURL(file);
  });
  e.target.value = "";
});

function adicionarImagemPorUrl() {
  const input = document.getElementById("form-imagem");
  const url = input.value.trim();
  if (!url) {
    toast("Informe a URL da imagem.", "err");
    return;
  }
  adicionarImagemGaleria(url, "Imagem por URL");
  input.value = "";
}

async function fazerUploadImagem(file, maxDim = 900) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });

  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    if (width > height) {
      height = Math.round(height * maxDim / width);
      width = maxDim;
    } else {
      width = Math.round(width * maxDim / height);
      height = maxDim;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.75);
}

// ── CRUD VEÍCULOS ────────────────────────────────────────────────────────────
function abrirModalCriar() {
  document.getElementById("modal-titulo").innerHTML = '<i class="fa-solid fa-car"></i> Cadastrar Novo Veículo';
  document.getElementById("form-id").value = "";
  document.getElementById("form-nome").value = "";
  document.getElementById("form-marca").value = "";
  document.getElementById("form-modelo").value = "";
  document.getElementById("form-versao").value = "";
  document.getElementById("form-categoria").value = "";
  document.getElementById("form-preco").value = "";
  document.getElementById("form-ano-fabricacao").value = "";
  document.getElementById("form-ano-modelo").value = "";
  document.getElementById("form-km").value = "";
  document.getElementById("form-cambio").value = "";
  document.getElementById("form-combustivel").value = "";
  document.getElementById("form-cor").value = "";
  document.getElementById("form-imagem").value = "";
  document.getElementById("form-descricao").value = "";
  document.getElementById("form-ativo").checked = true;
  document.getElementById("form-destaque").checked = false;
  resetarUpload();
  abrirModal("modal-produto");
}

function abrirModalEditar(docId) {
  const p = todosProdutos.find(x => x.docId === docId);
  if (!p) return;

  document.getElementById("modal-titulo").innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar Veículo';
  document.getElementById("form-id").value = docId;
  document.getElementById("form-nome").value = p.nome || "";
  document.getElementById("form-marca").value = p.marca || "";
  document.getElementById("form-modelo").value = p.modelo || "";
  document.getElementById("form-versao").value = p.versao || "";
  document.getElementById("form-categoria").value = p.categoria || "";
  document.getElementById("form-preco").value = p.preco || "";

  document.getElementById("form-ano-fabricacao").value = p.anoFabricacao || "";
  document.getElementById("form-ano-modelo").value = p.anoModelo || "";
  document.getElementById("form-km").value = p.km || "";
  document.getElementById("form-cambio").value = p.cambio || "";
  document.getElementById("form-combustivel").value = p.combustivel || "";
  document.getElementById("form-cor").value = p.cor || "";

  document.getElementById("form-descricao").value = p.descricao || "";
  document.getElementById("form-ativo").checked = p.ativo !== false;
  document.getElementById("form-destaque").checked = !!p.destaque;

  _imagensSelecionadas = Array.isArray(p.imagens) && p.imagens.length
    ? p.imagens.map((src, index) => ({ src, nome: `Foto ${index + 1}` }))
    : (p.imagem ? [{ src: p.imagem, nome: "Foto 1" }] : []);

  renderizarGaleriaImagens();
  abrirModal("modal-produto");
}

async function cancelarVendaRelacionadaAoVeiculo(docId) {
  const snap = await db.collection("vendas")
    .orderBy("criadoEm", "desc")
    .get();

  const vendas = snap.docs
    .map(d => ({ docId: d.id, ...d.data() }))
    .filter(v =>
      v.status !== "cancelada" &&
      Array.isArray(v.itens) &&
      v.itens.some(i => String(i.docId) === String(docId))
    );

  const venda = vendas[0];
  if (!venda) return null;

  const agora = firebase.firestore.FieldValue.serverTimestamp();
  await db.collection("vendas").doc(venda.docId).update({
    status: "cancelada",
    canceladaEm: agora,
    motivoCancelamento: "Veículo reativado no estoque pelo administrador."
  });

  const contas = new Map();
  const [porVenda, porPedido] = await Promise.all([
    db.collection("contasAReceber").where("vendaId", "==", venda.docId).get(),
    db.collection("contasAReceber").where("pedidoId", "==", venda.docId).get()
  ]);

  porVenda.docs.forEach(d => contas.set(d.id, d));
  porPedido.docs.forEach(d => contas.set(d.id, d));

  if (contas.size) {
    const batch = db.batch();
    contas.forEach(d => {
      batch.update(db.collection("contasAReceber").doc(d.id), {
        statusVenda: "cancelada",
        status: "cancelada",
        canceladaEm: agora
      });
    });
    await batch.commit();
  }

  return venda;
}

async function finalizarReativacaoVeiculo(docId, dados) {
  try {
    const venda = await cancelarVendaRelacionadaAoVeiculo(docId);

    const dadosReativacao = { ...dados, ativo: true, vendido: false };
    await db.collection("produtos").doc(docId).update(dadosReativacao);

    fecharModal("confirm-modal");
    fecharModal("modal-produto");

    toast(
      venda
        ? "Venda cancelada e veículo reativado no estoque."
        : "Veículo reativado no estoque.",
      "ok"
    );

    await Promise.all([
      carregarProdutos(),
      carregarVendasHoje(),
      carregarRelatorio(),
      carregarContasAReceber()
    ]);
    atualizarDashboard();
  } catch (e) {
    console.error("Erro ao cancelar venda/reativar veículo:", e);
    toast("Erro ao reativar veículo: " + e.message, "err");
  }
}

async function salvarProduto() {
  const docId = document.getElementById("form-id").value;
  let nome = document.getElementById("form-nome").value.trim();
  const marca = document.getElementById("form-marca").value.trim();
  const modelo = document.getElementById("form-modelo").value.trim();
  const versao = document.getElementById("form-versao").value.trim();
  const categoria = document.getElementById("form-categoria").value;
  const preco = parseFloat(document.getElementById("form-preco").value);
  const anoFabricacao = parseInt(document.getElementById("form-ano-fabricacao").value) || null;
  const anoModelo = parseInt(document.getElementById("form-ano-modelo").value) || null;
  const km = parseInt(document.getElementById("form-km").value) || 0;
  const cambio = document.getElementById("form-cambio").value;
  const combustivel = document.getElementById("form-combustivel").value;
  const cor = document.getElementById("form-cor").value.trim();
  const descricao = document.getElementById("form-descricao").value.trim();
  const ativo = document.getElementById("form-ativo").checked;
  const destaque = document.getElementById("form-destaque").checked;

  if (!nome && (marca || modelo)) {
    nome = `${marca} ${modelo} ${versao}`.trim();
  }

  if (!nome || !categoria || isNaN(preco)) {
    toast("Preencha nome/modelo, categoria e preço.", "err");
    return;
  }

  const imagens = [];
  try {
    for (const item of _imagensSelecionadas) {
      if (item.src && !item.file) {
        imagens.push(item.src);
      } else if (item.file) {
        const proc = await fazerUploadImagem(item.file);
        imagens.push(proc);
      }
    }
  } catch (e) {
    toast("Erro ao processar as fotos: " + e.message, "err");
    return;
  }

  const imagem = imagens[0] || "";

  const dados = {
  nome,
  categoria,
  preco,
  imagem,
  imagens,
  descricao,
  ativo,
  destaque,
  marca,
  modelo,
  versao,
  anoFabricacao,
  anoModelo,
  km,
  cambio,
  combustivel,
  cor,

  // Ao reativar um veículo vendido, ele volta a ficar disponível
  vendido: ativo ? false : (docId
    ? todosProdutos.find(p => String(p.docId || p.id) === String(docId))?.vendido === true
    : false)
 };

  const produtoAtual = docId
    ? todosProdutos.find(p => String(p.docId || p.id) === String(docId))
    : null;

  if (docId && ativo && produtoAtual?.vendido === true) {
    document.getElementById("confirm-msg").textContent =
      "Este veículo está marcado como vendido. Ao reativá-lo, a venda será cancelada no histórico e retirada dos totais. Deseja continuar?";

    document.getElementById("confirm-ok-btn").onclick = () =>
      finalizarReativacaoVeiculo(docId, dados);

    abrirModal("confirm-modal");
    return;
  }

  try {
    if (docId) {
      await db.collection("produtos").doc(docId).update(dados);
      toast("Veículo atualizado!", "ok");
    } else {
      const maxId = todosProdutos.length ? Math.max(...todosProdutos.map(p => Number(p.id) || 0)) : 0;
      await db.collection("produtos").doc(String(maxId + 1)).set({
        ...dados,
        id: maxId + 1,
        criadoEm: firebase.firestore.FieldValue.serverTimestamp()
      });
      toast("Veículo cadastrado no estoque!", "ok");
    }
    fecharModal("modal-produto");
    await carregarProdutos();
    atualizarDashboard();
  } catch (e) {
    toast("Erro ao salvar: " + e.message, "err");
  }
}

// ── CATEGORIAS ───────────────────────────────────────────────────────────────
async function carregarCategorias() {
  try {
    const snap = await db.collection("categorias").get();
    todasCategorias = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    renderizarCategorias();
  } catch (e) {
    toast("Erro ao carregar categorias: " + e.message, "err");
  }
}

function renderizarCategorias() {
  const grid = document.getElementById("cat-grid");
  if (!grid) return;

  if (!todasCategorias.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-tags"></i><p>Nenhuma categoria cadastrada.</p></div>`;
    return;
  }

  grid.innerHTML = todasCategorias.map(c => {
    const qtd = todosProdutos.filter(p => p.categoria === c.id || p.categoria === c.nome).length;
    return `
    <div class="cat-card">
      <div class="cat-card-left">
        <div class="cat-icon"><i class="fa-solid ${c.icone || 'fa-car'}"></i></div>
        <div>
          <div class="cat-name">${c.nome}</div>
          <div class="cat-id">${qtd} veículo(s) • ID: ${c.id || c.docId}</div>
        </div>
      </div>
      <div class="actions-cell">
        <button class="btn btn-ghost btn-sm" onclick="abrirModalCategoriaEditar('${c.docId}')"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-danger btn-sm" onclick="confirmarExclusao('categoria','${c.docId}','${(c.nome || '').replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`;
  }).join("");
}

function abrirModalCategoria() {
  document.getElementById("cat-id-original").value = "";
  document.getElementById("cat-nome").value = "";
  document.getElementById("cat-id").value = "";
  document.getElementById("cat-icone").value = "fa-car";
  abrirModal("modal-categoria");
}

function abrirModalCategoriaEditar(docId) {
  const c = todasCategorias.find(x => x.docId === docId);
  if (!c) return;
  document.getElementById("cat-id-original").value = docId;
  document.getElementById("cat-nome").value = c.nome || "";
  document.getElementById("cat-id").value = c.id || c.docId || "";
  document.getElementById("cat-icone").value = c.icone || "fa-car";
  abrirModal("modal-categoria");
}

async function salvarCategoria() {
  const docIdOriginal = document.getElementById("cat-id-original").value;
  const nome = document.getElementById("cat-nome").value.trim();
  const id = document.getElementById("cat-id").value.trim().replace(/\s+/g, "");
  const icone = document.getElementById("cat-icone").value.trim() || "fa-car";

  if (!nome || !id) {
    toast("Preencha o nome e o identificador.", "err");
    return;
  }

  try {
    if (docIdOriginal) {
      await db.collection("categorias").doc(docIdOriginal).update({ nome, id, icone });
    } else {
      await db.collection("categorias").doc(id).set({ nome, id, icone });
    }
    toast("Categoria salva!", "ok");
    fecharModal("modal-categoria");
    await carregarCategorias();
    popularSelectCategorias();
  } catch (e) {
    toast("Erro: " + e.message, "err");
  }
}

// ── MARCAS ───────────────────────────────────────────────────────────────────
async function carregarMarcas() {
  try {
    const snap = await db.collection("marcas").get();
    todasMarcas = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    renderizarMarcas();
    popularSelectMarcas();
  } catch (e) {
    toast("Erro ao carregar marcas: " + e.message, "err");
  }
}

function renderizarMarcas() {
  const grid = document.getElementById("marca-grid");
  if (!grid) return;

  if (!todasMarcas.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-car-side"></i><p>Nenhuma marca cadastrada.</p></div>`;
    return;
  }

  grid.innerHTML = todasMarcas.map(m => {
    const qtd = todosProdutos.filter(p => p.marca === m.nome || p.marca === m.id).length;
    return `
    <div class="cat-card">
      <div class="cat-card-left">
        <div class="cat-icon"><i class="fa-solid fa-car-side"></i></div>
        <div>
          <div class="cat-name">${m.nome}</div>
          <div class="cat-id">${qtd} veículo(s) • ID: ${m.id || m.docId}</div>
        </div>
      </div>
      <div class="actions-cell">
        <button class="btn btn-ghost btn-sm" onclick="abrirModalMarcaEditar('${m.docId}')"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-danger btn-sm" onclick="confirmarExclusao('marca','${m.docId}','${(m.nome || '').replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`;
  }).join("");
}

function abrirModalMarca() {
  document.getElementById("marca-id-original").value = "";
  document.getElementById("marca-nome").value = "";
  document.getElementById("marca-id").value = "";
  abrirModal("modal-marca");
}

function abrirModalMarcaEditar(docId) {
  const m = todasMarcas.find(x => x.docId === docId);
  if (!m) return;
  document.getElementById("marca-id-original").value = docId;
  document.getElementById("marca-nome").value = m.nome || "";
  document.getElementById("marca-id").value = m.id || m.docId || "";
  abrirModal("modal-marca");
}

async function salvarMarca() {
  const docIdOriginal = document.getElementById("marca-id-original").value;
  const nome = document.getElementById("marca-nome").value.trim();
  const id = document.getElementById("marca-id").value.trim().replace(/\s+/g, "");

  if (!nome || !id) {
    toast("Preencha nome e ID.", "err");
    return;
  }

  try {
    if (docIdOriginal) {
      await db.collection("marcas").doc(docIdOriginal).update({ nome, id });
    } else {
      await db.collection("marcas").doc(id).set({ nome, id });
    }
    toast("Marca salva!", "ok");
    fecharModal("modal-marca");
    await carregarMarcas();
    popularSelectMarcas();
  } catch (e) {
    toast("Erro: " + e.message, "err");
  }
}

// ── CUPONS ───────────────────────────────────────────────────────────────────
async function carregarCupons() {
  try {
    const snap = await db.collection("cupons").get();
    todosCupons = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    renderizarCupons();
  } catch (e) {
    toast("Erro ao carregar cupons: " + e.message, "err");
  }
}

function renderizarCupons() {
  const tbody = document.getElementById("cupons-tabela-corpo");
  if (!tbody) return;

  if (!todosCupons.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-ticket"></i><p>Nenhum cupom cadastrado.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = todosCupons.map(c => {
    const valorFmt = c.tipo === "fixo" ? formatarMoeda(c.valor) : `${Number(c.valor || 0)}%`;
    const minimoFmt = c.valorMinimo ? formatarMoeda(c.valorMinimo) : '–';
    const validadeFmt = c.validade ? new Date(c.validade + "T00:00:00").toLocaleDateString('pt-BR') : '–';
    return `
    <tr>
      <td><strong>${c.codigo}</strong></td>
      <td>${c.tipo === "fixo" ? "Valor fixo" : "Percentual"}</td>
      <td style="font-weight:700;color:var(--text-main)">${valorFmt}</td>
      <td>${minimoFmt}</td>
      <td>${validadeFmt}</td>
      <td>${c.ativo !== false ? '<span class="badge badge-ativo">Ativo</span>' : '<span class="badge badge-inativo">Inativo</span>'}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-ghost btn-sm" onclick="abrirModalCupomEditar('${c.docId}')"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-danger btn-sm" onclick="confirmarExclusao('cupom','${c.docId}','${(c.codigo || '').replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join("");
}

function abrirModalCupom() {
  document.getElementById("cupom-modal-titulo").innerHTML = '<i class="fa-solid fa-plus"></i> Novo Cupom';
  document.getElementById("cupom-doc-id").value = "";
  document.getElementById("cupom-codigo").value = "";
  document.getElementById("cupom-tipo").value = "percentual";
  document.getElementById("cupom-valor").value = "";
  document.getElementById("cupom-valor-minimo").value = "";
  document.getElementById("cupom-validade").value = "";
  document.getElementById("cupom-ativo").checked = true;
  abrirModal("modal-cupom");
}

function abrirModalCupomEditar(docId) {
  const c = todosCupons.find(x => x.docId === docId);
  if (!c) return;
  document.getElementById("cupom-modal-titulo").innerHTML = '<i class="fa-solid fa-pen"></i> Editar Cupom';
  document.getElementById("cupom-doc-id").value = docId;
  document.getElementById("cupom-codigo").value = c.codigo || "";
  document.getElementById("cupom-tipo").value = c.tipo || "percentual";
  document.getElementById("cupom-valor").value = c.valor ?? "";
  document.getElementById("cupom-valor-minimo").value = c.valorMinimo ?? "";
  document.getElementById("cupom-validade").value = c.validade || "";
  document.getElementById("cupom-ativo").checked = c.ativo !== false;
  abrirModal("modal-cupom");
}

async function salvarCupom() {
  const docId = document.getElementById("cupom-doc-id").value;
  const codigo = document.getElementById("cupom-codigo").value.trim().toUpperCase();
  const tipo = document.getElementById("cupom-tipo").value;
  const valor = parseFloat(document.getElementById("cupom-valor").value);
  const valorMinimoRaw = document.getElementById("cupom-valor-minimo").value;
  const valorMinimo = valorMinimoRaw ? parseFloat(valorMinimoRaw) : 0;
  const validade = document.getElementById("cupom-validade").value || null;
  const ativo = document.getElementById("cupom-ativo").checked;

  if (!codigo || isNaN(valor)) {
    toast("Preencha o código e o valor.", "err");
    return;
  }
  if (tipo === "percentual" && valor > 100) {
    toast("O percentual não pode ser maior que 100%.", "err");
    return;
  }

  const jaExiste = todosCupons.find(c => c.codigo === codigo && c.docId !== docId);
  if (jaExiste) {
    toast("Já existe um cupom com este código.", "err");
    return;
  }

  const dados = { codigo, tipo, valor, valorMinimo, validade, ativo };
  try {
    if (docId) {
      await db.collection("cupons").doc(docId).update(dados);
      toast("Cupom atualizado!", "ok");
    } else {
      await db.collection("cupons").add(dados);
      toast("Cupom criado!", "ok");
    }
    fecharModal("modal-cupom");
    await carregarCupons();
  } catch (e) {
    toast("Erro: " + e.message, "err");
  }
}

// ── CONFIRMAÇÃO DE EXCLUSÃO ──────────────────────────────────────────────────
function confirmarExclusao(tipo, docId, nome) {
  document.getElementById("confirm-msg").textContent = `Excluir "${nome}"? Esta ação não pode ser desfeita.`;
  document.getElementById("confirm-ok-btn").onclick = async () => {
    try {
      if (tipo === "produto") {
        await db.collection("produtos").doc(docId).delete();
        await carregarProdutos();
      } else if (tipo === "cupom") {
        await db.collection("cupons").doc(docId).delete();
        await carregarCupons();
      } else if (tipo === "marca") {
        await db.collection("marcas").doc(docId).delete();
        await carregarMarcas();
      } else {
        await db.collection("categorias").doc(docId).delete();
        await carregarCategorias();
        popularSelectCategorias();
      }
      toast("Excluído com sucesso.", "ok");
      fecharModal("confirm-modal");
      atualizarDashboard();
    } catch (e) {
      toast("Erro: " + e.message, "err");
    }
  };
  abrirModal("confirm-modal");
}

// ── VENDAS / PDV ─────────────────────────────────────────────────────────────
function renderPdvGrid() {
  const grid = document.getElementById("pdv-grid");
  if (!grid) return;

  const busca = (document.getElementById("pdv-busca")?.value || "").toLowerCase();
  let lista = todosProdutos.filter(p => p.ativo !== false);
  if (busca) {
    lista = lista.filter(p =>
      (p.nome || "").toLowerCase().includes(busca) ||
      (p.marca || "").toLowerCase().includes(busca) ||
      (p.modelo || "").toLowerCase().includes(busca)
    );
  }

  if (!lista.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-car-side"></i><p>Nenhum veículo disponível.</p></div>`;
    return;
  }

  grid.innerHTML = lista.map(p => `
    <div class="pdv-item" onclick="pdvAdicionarItem('${p.docId}')">
      ${p.imagem ? `<img src="${p.imagem}" alt="${p.nome}">` : '<div class="pdv-item-noimg"><i class="fa-solid fa-car"></i></div>'}
      <div class="pdv-item-nome">${p.marca ? p.marca + ' ' : ''}${p.modelo || p.nome}</div>
      <div class="pdv-item-preco">${formatarMoeda(p.preco)}</div>
    </div>
  `).join("");
}

function pdvAdicionarItem(docId) {
  const p = todosProdutos.find(x => x.docId === docId);
  if (!p) return;
  const item = pdvCarrinho.find(i => i.docId === docId);
  if (item) item.qtd += 1;
  else pdvCarrinho.push({ docId, nome: `${p.marca ? p.marca + ' ' : ''}${p.modelo || p.nome}`, preco: Number(p.preco || 0), qtd: 1 });
  renderPdvCart();
}

function pdvAlterarQtd(docId, delta) {
  const item = pdvCarrinho.find(i => i.docId === docId);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0) pdvCarrinho = pdvCarrinho.filter(i => i.docId !== docId);
  renderPdvCart();
}

function pdvRemoverItem(docId) {
  pdvCarrinho = pdvCarrinho.filter(i => i.docId !== docId);
  renderPdvCart();
}

function pdvLimparCarrinho() {
  pdvCarrinho = [];
  pdvCupomAplicado = null;
  if (document.getElementById("pdv-cupom-input")) document.getElementById("pdv-cupom-input").value = "";
  if (document.getElementById("pdv-desconto-manual")) document.getElementById("pdv-desconto-manual").value = "";
  if (document.getElementById("pdv-cliente")) document.getElementById("pdv-cliente").value = "";
  if (document.getElementById("pdv-cliente-telefone")) document.getElementById("pdv-cliente-telefone").value = "";
  if (document.getElementById("pdv-porcentagem-acrescimo")) document.getElementById("pdv-porcentagem-acrescimo").value = "0";
  if (document.getElementById("pdv-qtd-parcelas")) document.getElementById("pdv-qtd-parcelas").value = "1";

  const pag = document.getElementById("pdv-pagamento");
  if (pag) pag.value = "dinheiro";

  const div = document.getElementById("pdv-pagamento-dividir");
  if (div) div.checked = false;

  const val2 = document.getElementById("pdv-valor-pagamento2");
  if (val2) val2.value = "";

  pdvTogglePagamentoDividido();
  toggleOpcoesAPrazo();
  renderPdvCart();
}

function pdvTogglePagamentoDividido() {
  const dividir = document.getElementById("pdv-pagamento-dividir")?.checked;
  const area = document.getElementById("pdv-pagamento2-area");
  if (area) area.style.display = dividir ? "flex" : "none";
  renderPdvCart();
}

function toggleOpcoesAPrazo() {
  const pgto1 = document.getElementById("pdv-pagamento")?.value;
  const dividir = document.getElementById("pdv-pagamento-dividir")?.checked;
  const pgto2 = document.getElementById("pdv-pagamento2") ? document.getElementById("pdv-pagamento2").value : "";
  const container = document.getElementById("pdv-container-a-prazo");

  if (!container) return;
  if (pgto1 === "prazo" || (dividir && pgto2 === "prazo")) {
    container.style.display = "block";
    calcularSimulacaoParcelas();
  } else {
    container.style.display = "none";
  }
}

function pdvCalcularSubtotal() {
  return pdvCarrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
}

function pdvCalcularDesconto(subtotal) {
  const manual = parseFloat(document.getElementById("pdv-desconto-manual")?.value) || 0;
  let descontoCupom = 0;
  if (pdvCupomAplicado) {
    descontoCupom = pdvCupomAplicado.tipo === "fixo"
      ? Number(pdvCupomAplicado.valor || 0)
      : subtotal * (Number(pdvCupomAplicado.valor || 0) / 100);
  }
  return Math.min(subtotal, manual + descontoCupom);
}

function pdvCalcularPagamentos(total) {
  const dividir = document.getElementById("pdv-pagamento-dividir")?.checked;
  const forma1 = document.getElementById("pdv-pagamento")?.value || "dinheiro";
  if (!dividir) return [{ forma: forma1, valor: total }];

  const forma2 = document.getElementById("pdv-pagamento2")?.value || "credito";
  let valor2 = parseFloat(document.getElementById("pdv-valor-pagamento2")?.value) || 0;
  valor2 = Math.max(0, Math.min(valor2, total));
  const valor1 = total - valor2;
  return [{ forma: forma1, valor: valor1 }, { forma: forma2, valor: valor2 }];
}

function pdvCalcularValorAPrazo(total, pagamentos) {
  const pgto1 = pagamentos[0];
  const pgto2 = pagamentos[1];

  if (pgto1 && pgto1.forma === "prazo" && pgto2 && pgto2.forma === "prazo") return total;
  if (pgto1 && pgto1.forma === "prazo") return pgto1.valor;
  if (pgto2 && pgto2.forma === "prazo") return pgto2.valor;
  return total;
}

async function pdvFinalizarVenda() {

  if (!pdvCarrinho.length) {
    toast("Adicione ao menos um veículo para fechar a venda.", "err");
    return;
  }

  const subtotal = pdvCalcularSubtotal();
  const desconto = pdvCalcularDesconto(subtotal);
  const totalOriginal = subtotal - desconto;
  const pagamentos = pdvCalcularPagamentos(totalOriginal);

  const cliente = document.getElementById("pdv-cliente")?.value.trim();
  const telefone = document.getElementById("pdv-cliente-telefone")?.value.trim() || null;

  if (
    pagamentos.length > 1 &&
    (pagamentos[0].valor <= 0 || pagamentos[1].valor <= 0)
  ) {
    toast("Informe um valor válido para a 2ª forma de pagamento.", "err");
    return;
  }

  const possuiAPrazo = pagamentos.some(p => p.forma === "prazo");

  if (possuiAPrazo && !cliente) {
    toast("Informe o nome do cliente para venda a prazo.", "err");
    return;
  }

  let dadosPrazo = null;
  let totalFinalVenda = totalOriginal;

  if (possuiAPrazo) {

    const valorBaseAPrazo = pdvCalcularValorAPrazo(
      totalOriginal,
      pagamentos
    );

    const acrescimoPct =
      parseFloat(
        document.getElementById("pdv-porcentagem-acrescimo")?.value
      ) || 0;

    const qtdParcelas =
      parseInt(
        document.getElementById("pdv-qtd-parcelas")?.value
      ) || 1;

    const valorJuros =
      valorBaseAPrazo * (acrescimoPct / 100);

    const valorTotalPrazoComJuros =
      valorBaseAPrazo + valorJuros;

    const valorParcela =
      valorTotalPrazoComJuros / qtdParcelas;

    totalFinalVenda =
      (totalOriginal - valorBaseAPrazo) +
      valorTotalPrazoComJuros;

    dadosPrazo = {
      valorBase: valorBaseAPrazo,
      acrescimoPct,
      valorJuros,
      valorTotalPrazoComJuros,
      qtdParcelas,
      valorParcela
    };
  }

  const venda = {
    itens: pdvCarrinho.map(i => ({
      docId: i.docId,
      nome: i.nome,
      preco: i.preco,
      qtd: i.qtd
    })),

    subtotal,
    desconto,
    total: totalFinalVenda,

    pagamentos,

    pagamento: pagamentos
      .map(p => PAG_LABEL[p.forma] || p.forma)
      .join(" + "),

    cliente: cliente || null,
    telefone,

    prazoDetalhes: dadosPrazo,

    cupom: pdvCupomAplicado
      ? pdvCupomAplicado.codigo
      : null,

    criadoEm:
      firebase.firestore.FieldValue.serverTimestamp()
  };

  try {

    const refDoc =
      await db.collection("vendas").add(venda);

    if (possuiAPrazo && dadosPrazo) {

      await db.collection("contasAReceber").add({

        vendaId: refDoc.id,
        pedidoId: refDoc.id,

        cliente: cliente,
        telefoneCliente: telefone || null,

        valorOriginal:
          dadosPrazo.valorTotalPrazoComJuros,

        totalAReceber:
          dadosPrazo.valorTotalPrazoComJuros,

        totalPago: 0,

        saldoRestante:
          dadosPrazo.valorTotalPrazoComJuros,

        qtdParcelas:
          dadosPrazo.qtdParcelas,

        valorParcela:
          dadosPrazo.valorParcela,

        statusVenda: "em_aberto",

        descricao:
          `Venda a prazo de veículo (${dadosPrazo.qtdParcelas}x)`,

        criadoEm:
          firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    // Marca os veículos vendidos como inativos e vendidos
    const batch = db.batch();

    pdvCarrinho.forEach(item => {

      const produtoRef =
        db.collection("produtos").doc(item.docId);

      batch.update(produtoRef, {
        ativo: false,
        vendido: true
      });

    });

    await batch.commit();

    toast("Venda finalizada com sucesso!", "ok");

    pdvLimparCarrinho();

    await carregarProdutos();
    await carregarVendasHoje();
    await carregarContasAReceber();

    atualizarDashboard();

  } catch (e) {

    console.error("Erro ao finalizar venda:", e);

    toast(
      "Erro ao finalizar venda: " + e.message,
      "err"
    );
  }
}

function calcularSimulacaoParcelas() {
  const subtotal = pdvCalcularSubtotal();
  const desconto = pdvCalcularDesconto(subtotal);
  const totalGeral = subtotal - desconto;
  const pagamentos = pdvCalcularPagamentos(totalGeral);

  const valorBaseAPrazo = pdvCalcularValorAPrazo(totalGeral, pagamentos);
  const acrescimoPct = parseFloat(document.getElementById("pdv-porcentagem-acrescimo")?.value) || 0;
  const qtdParcelas = parseInt(document.getElementById("pdv-qtd-parcelas")?.value) || 1;

  const valorJuros = valorBaseAPrazo * (acrescimoPct / 100);
  const valorTotalAPrazo = valorBaseAPrazo + valorJuros;
  const valorParcela = valorTotalAPrazo / qtdParcelas;

  const resEl = document.getElementById("pdv-resumo-parcelamento");
  if (resEl) {
    if (acrescimoPct > 0) {
      resEl.innerHTML = `
        <div>Valor a prazo original: ${formatarMoeda(valorBaseAPrazo)}</div>
        <div>Com acréscimo (${acrescimoPct}%): ${formatarMoeda(valorTotalAPrazo)}</div>
        <div style="font-size:1.1rem;color:var(--text-main);margin-top:4px;">${qtdParcelas}x de ${formatarMoeda(valorParcela)}</div>
      `;
    } else {
      resEl.innerHTML = `<div style="font-size:1.1rem;color:var(--text-main);">${qtdParcelas}x de ${formatarMoeda(valorParcela)}</div>`;
    }
  }
}

function renderPdvCart() {
  const cont = document.getElementById("pdv-cart-items");
  if (!cont) return;

  if (!pdvCarrinho.length) {
    cont.innerHTML = `<div class="pdv-cart-empty">Nenhum veículo selecionado. Clique em um veículo no estoque para iniciar a venda.</div>`;
  } else {
    cont.innerHTML = pdvCarrinho.map(i => `
      <div class="pdv-cart-item">
        <div class="pdv-cart-item-info">
          <div class="pdv-cart-item-nome">${i.nome}</div>
          <div class="pdv-cart-item-preco">${formatarMoeda(i.preco)}</div>
        </div>
        <div class="pdv-qty">
          <button class="pdv-qty-btn" onclick="pdvAlterarQtd('${i.docId}',-1)">−</button>
          <span>${i.qtd}</span>
          <button class="pdv-qty-btn" onclick="pdvAlterarQtd('${i.docId}',1)">+</button>
        </div>
        <div class="pdv-cart-item-total">${formatarMoeda(i.preco * i.qtd)}</div>
        <button class="pdv-remove-btn" onclick="pdvRemoverItem('${i.docId}')"><i class="fa-solid fa-trash"></i></button>
      </div>`).join("");
  }

  const subtotal = pdvCalcularSubtotal();
  const desconto = pdvCalcularDesconto(subtotal);
  const total = subtotal - desconto;

  const elSub = document.getElementById("pdv-subtotal");
  const elDesc = document.getElementById("pdv-desconto-total");
  const elTotal = document.getElementById("pdv-total");

  if (elSub) elSub.textContent = formatarMoeda(subtotal);
  if (elDesc) elDesc.textContent = formatarMoeda(desconto);
  if (elTotal) elTotal.textContent = formatarMoeda(total);

  const resumo = document.getElementById("pdv-split-resumo");
  if (document.getElementById("pdv-pagamento-dividir")?.checked) {
    const pags = pdvCalcularPagamentos(total);
    if (resumo) {
      resumo.style.display = "flex";
      resumo.innerHTML = pags.map(p => `
        <div class="pdv-totals-row">
          <span>${PAG_LABEL[p.forma] || p.forma}</span>
          <span>${formatarMoeda(p.valor)}</span>
        </div>
      `).join("");
    }
  } else if (resumo) {
    resumo.style.display = "none";
    resumo.innerHTML = "";
  }

  calcularSimulacaoParcelas();
}

function pdvAplicarCupom() {
  const codigo = document.getElementById("pdv-cupom-input")?.value.trim().toUpperCase();
  if (!codigo) return;
  const cupom = todosCupons.find(c => c.codigo === codigo && c.ativo !== false);
  if (!cupom) {
    toast("Cupom inválido ou inativo.", "err");
    return;
  }
  const subtotal = pdvCalcularSubtotal();
  if (cupom.valorMinimo && subtotal < cupom.valorMinimo) {
    toast(`Pedido mínimo para este cupom: ${formatarMoeda(cupom.valorMinimo)}`, "err");
    return;
  }
  pdvCupomAplicado = cupom;
  toast("Cupom aplicado!", "ok");
  renderPdvCart();
}

async function carregarVendasHoje() {
  try {
    const inicioHoje = new Date();
    inicioHoje.setHours(0, 0, 0, 0);
    const snap = await db.collection("vendas")
      .where("criadoEm", ">=", inicioHoje)
      .orderBy("criadoEm", "desc")
      .get();
    vendasHoje = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    renderVendasHoje();
  } catch (e) {
    const el = document.getElementById("pdv-vendas-tabela");
    if (el) {
      el.innerHTML = `<tr><td colspan="6"><div class="empty-state"><p>Erro ao carregar vendas: ${e.message}</p></div></td></tr>`;
    }
  }
}

function linhaVenda(v, origem, comData) {
  const dt = v.criadoEm?.toDate ? v.criadoEm.toDate() : null;
  const hora = dt ? dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '–';
  const data = dt ? dt.toLocaleDateString('pt-BR') : '–';
  const itensResumo = (v.itens || []).map(i => `${i.qtd}x ${i.nome}`).join(", ");

  const pagamentoTexto = Array.isArray(v.pagamentos)
    ? v.pagamentos.map(p => `${PAG_LABEL[p.forma] || p.forma} (${formatarMoeda(p.valor)})`).join(" + ")
    : (PAG_LABEL[v.pagamento] || v.pagamento || '–');

  const cancelada = v.status === "cancelada";

  return `
  <tr>
    ${comData ? `<td>${data}</td>` : ''}
    <td>${hora}</td>
    <td><strong>${v.cliente || 'Consumidor'}</strong>${v.telefone ? `<br><small style="color:var(--text-muted);">${v.telefone}</small>` : ''}</td>
    <td style="max-width:240px"><span style="font-size:0.84rem;color:var(--text-muted)">${itensResumo}</span></td>
    <td><span class="badge" style="background:#f1f5f9;color:#334155;">${pagamentoTexto}</span></td>
    <td style="font-weight:800;color:${cancelada ? '#dc2626' : 'var(--text-main)'};">
      ${formatarMoeda(v.total)}
      ${cancelada ? `<br><span style="margin-top:5px;display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:999px;background:#fee2e2;color:#dc2626;font-size:0.72rem;font-weight:800;"><i class="fa-solid fa-ban"></i> CANCELADA</span>` : ''}
    </td>
    <td>
      <button class="btn btn-danger btn-sm" onclick="confirmarExclusaoVenda('${v.docId}','${origem}')" title="Excluir venda">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  </tr>`;
}

function renderVendasHoje() {
  const tbody = document.getElementById("pdv-vendas-tabela");
  const elQtd = document.getElementById("pdv-stat-qtd");
  const elTotal = document.getElementById("pdv-stat-total");

  const vendasValidas = vendasHoje.filter(v => v.status !== "cancelada");
  if (elQtd) elQtd.textContent = vendasValidas.length;
  const total = vendasValidas.reduce((s, v) => s + Number(v.total || 0), 0);
  if (elTotal) elTotal.textContent = formatarMoeda(total);

  if (!tbody) return;
  if (!vendasHoje.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-receipt"></i><p>Nenhuma venda registrada hoje.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = vendasHoje.map(v => linhaVenda(v, "pdv", false)).join("");
}

function confirmarExclusaoVenda(docId, origem) {
  document.getElementById("confirm-msg").textContent = "Excluir esta venda e as parcelas vinculadas no Contas a Receber? Esta ação não pode ser desfeita.";
  document.getElementById("confirm-ok-btn").onclick = async () => {
    try {
      const [snapVendaId, snapPedidoId] = await Promise.all([
        db.collection("contasAReceber").where("vendaId", "==", docId).get(),
        db.collection("contasAReceber").where("pedidoId", "==", docId).get()
      ]);

      const exclusoesContas = [];
      snapVendaId.docs.forEach(doc => exclusoesContas.push(db.collection("contasAReceber").doc(doc.id).delete()));
      snapPedidoId.docs.forEach(doc => exclusoesContas.push(db.collection("contasAReceber").doc(doc.id).delete()));
      await Promise.all(exclusoesContas);

      await db.collection("vendas").doc(docId).delete();

      toast("Venda excluída com sucesso!", "ok");
      fecharModal("confirm-modal");

      await Promise.all([
        carregarVendasHoje(),
        carregarRelatorio(),
        carregarContasAReceber()
      ]);
      atualizarDashboard();
    } catch (e) {
      toast("Erro ao excluir venda: " + e.message, "err");
    }
  };
  abrirModal("confirm-modal");
}

async function carregarVendasHoje() {
  try {
    const inicioHoje = new Date();
    inicioHoje.setHours(0, 0, 0, 0);
    const snap = await db.collection("vendas")
      .where("criadoEm", ">=", inicioHoje)
      .orderBy("criadoEm", "desc")
      .get();
    vendasHoje = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    renderVendasHoje();
  } catch (e) {
    const el = document.getElementById("pdv-vendas-tabela");
    if (el) {
      el.innerHTML = `<tr><td colspan="6"><div class="empty-state"><p>Erro ao carregar vendas: ${e.message}</p></div></td></tr>`;
    }
  }
}

// ── RELATÓRIOS ───────────────────────────────────────────────────────────────
async function carregarRelatorio() {
  try {
    const mesStr = document.getElementById("relatorio-mes")?.value || mesAtualStr();
    const [ano, mes] = mesStr.split("-").map(Number);
    const inicio = new Date(ano, mes - 1, 1, 0, 0, 0, 0);
    const fim = new Date(ano, mes, 1, 0, 0, 0, 0);

    const snap = await db.collection("vendas")
      .where("criadoEm", ">=", inicio)
      .where("criadoEm", "<", fim)
      .orderBy("criadoEm", "desc")
      .get();

    vendasRelatorio = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    renderRelatorio();
  } catch (e) {
    const tbody = document.getElementById("relatorio-tabela");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><p>Erro ao carregar relatório: ${e.message}</p></div></td></tr>`;
    }
  }
}

function renderRelatorio() {
  const vendasValidas = vendasRelatorio.filter(v => v.status !== "cancelada");
  const totalMes = vendasValidas.reduce((s, v) => s + Number(v.total || 0), 0);
  const elQtd = document.getElementById("relatorio-stat-qtd");
  const elTotal = document.getElementById("relatorio-stat-total");
  const elTicket = document.getElementById("relatorio-stat-ticket");

  if (elQtd) elQtd.textContent = vendasValidas.length;
  if (elTotal) elTotal.textContent = formatarMoeda(totalMes);
  if (elTicket) elTicket.textContent = formatarMoeda(vendasValidas.length ? totalMes / vendasValidas.length : 0);

  const tbody = document.getElementById("relatorio-tabela");
  if (!tbody) return;

  if (!vendasRelatorio.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-chart-line"></i><p>Nenhuma venda encontrada para o período selecionado.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = vendasRelatorio.map(v => linhaVenda(v, "relatorio", true)).join("");
}

// ── CONTAS A RECEBER / FINANCEIRO ─────────────────────────────────────────────
function ativarAbaContasAReceber(btn) {
  mudarTab('contas-a-receber', btn);
  carregarContasAReceber();
}

async function carregarContasAReceber() {
  try {
    const snap = await db.collection("contasAReceber").orderBy("criadoEm", "desc").get();
    todasContasAReceber = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    renderizarContasAReceber();
  } catch (e) {
    const container = document.getElementById("contas-a-receber-list-container");
    if (container) {
      container.innerHTML = `<div class="empty-state"><p>Erro ao carregar contas: ${e.message}</p></div>`;
    }
  }
}

function enviarMensagemWhatsApp(docId) {
  const conta = todasContasAReceber.find(c => c.docId === docId);
  if (!conta) { toast("Registro não encontrado.", "err"); return; }
  if (!conta.telefoneCliente) { toast("Cliente não possui telefone cadastrado.", "err"); return; }

  let tel = conta.telefoneCliente.replace(/\D/g, "");
  if (tel.length >= 10 && !tel.startsWith("55")) tel = "55" + tel;

  const cliente = conta.cliente || "Cliente";
  const idPedido = conta.pedidoId || conta.vendaId || conta.docId.substring(0, 6);
  const valTotalNum = conta.valorOriginal || conta.totalAReceber || 0;
  const valTotal = formatarMoeda(valTotalNum);
  const valPago = formatarMoeda(conta.totalPago || 0);
  const saldoRestante = formatarMoeda(conta.saldoRestante !== undefined ? conta.saldoRestante : 0);
  const qtdParcelas = parseInt(conta.qtdParcelas) || 1;

  let textoParcelas = "";
  if (qtdParcelas > 1) {
    const valorParcela = formatarMoeda(valTotalNum / qtdParcelas);
    textoParcelas = `\n📌 *Condições:* ${qtdParcelas}x de ${valorParcela}`;
  } else {
    textoParcelas = `\n📌 *Condições:* Parcela única / À vista`;
  }

  const msg = `Olá, *${cliente}*! Tudo bem? 🚗\n\n` +
    `Aqui é da revenda de veículos. Segue o resumo financeiro da sua negociação:\n\n` +
    `📄 *Contrato/Ref:* #${idPedido}\n` +
    `💰 *Valor Total:* ${valTotal}` +
    `${textoParcelas}\n` +
    `✅ *Total Pago:* ${valPago}\n` +
    `⚠️ *Saldo Devedor:* ${saldoRestante}\n\n` +
    `Estamos à sua inteira disposição para qualquer esclarecimento ou envio de chave PIX. Um abraço!`;

  window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, "_blank");
}

function renderizarContasAReceber() {
  const cont = document.getElementById("contas-a-receber-list-container");
  if (!cont) return;

  const busca = (document.getElementById("contas-a-receber-search")?.value || "").toLowerCase();
  let listaFiltrada = todasContasAReceber;

  if (busca) {
    listaFiltrada = todasContasAReceber.filter(c =>
      (c.cliente && c.cliente.toLowerCase().includes(busca)) ||
      (c.descricao && c.descricao.toLowerCase().includes(busca)) ||
      (c.telefoneCliente && c.telefoneCliente.toLowerCase().includes(busca)) ||
      (c.docId && c.docId.toLowerCase().includes(busca))
    );
  }

  let totalPendente = 0;
  let totalRecebido = 0;
  let totalGeral = 0;

  todasContasAReceber.forEach(conta => {
    const orig = conta.valorOriginal || conta.totalAReceber || 0;
    const pago = conta.totalPago || 0;
    const rest = conta.saldoRestante !== undefined ? conta.saldoRestante : (orig - pago);

    totalGeral += orig;
    totalRecebido += pago;
    if (rest > 0) totalPendente += rest;
  });

  const elPendente = document.getElementById("cr-total-pendente");
  const elRecebido = document.getElementById("cr-total-recebido");
  const elGeral = document.getElementById("cr-total-geral");

  if (elPendente) elPendente.textContent = formatarMoeda(totalPendente);
  if (elRecebido) elRecebido.textContent = formatarMoeda(totalRecebido);
  if (elGeral) elGeral.textContent = formatarMoeda(totalGeral);

  if (!listaFiltrada.length) {
    cont.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-file-invoice-dollar"></i><p>Nenhuma conta a receber encontrada.</p></div>`;
    return;
  }

  cont.innerHTML = listaFiltrada.map(conta => {
    const valOriginal = conta.valorOriginal || conta.totalAReceber || 0;
    const totalPago = conta.totalPago || 0;
    const saldoRestante = conta.saldoRestante !== undefined ? conta.saldoRestante : (valOriginal - totalPago);
    const qtdParcelas = parseInt(conta.qtdParcelas) || 1;

    const pctPago = valOriginal > 0 ? Math.min(100, Math.round((totalPago / valOriginal) * 100)) : 0;
    const cancelada = conta.status === 'cancelada' || conta.statusVenda === 'cancelada';
    const statusBadgeClass = cancelada ? 'em-aberto' : (saldoRestante <= 0 ? 'quitada' : (totalPago > 0 ? 'parcial' : 'em-aberto'));
    const statusText = cancelada ? 'Cancelada' : (saldoRestante <= 0 ? 'Quitada' : (totalPago > 0 ? 'Parcial' : 'Em Aberto'));

    const clienteInfo = conta.cliente || 'Cliente não informado';
    const telefoneInfo = conta.telefoneCliente ? `<div class="conta-telefone">📞 ${conta.telefoneCliente}</div>` : '';
    const descricaoInfo = conta.descricao ? `<div style="font-size:0.8rem;color:var(--text-muted);">${conta.descricao}</div>` : '';
    const idPedidoInfo = (conta.pedidoId || conta.vendaId) ? `<div style="font-size:0.75rem;color:var(--text-muted);">Ref/Pedido: #${conta.pedidoId || conta.vendaId}</div>` : '';

    const valorPorParcela = valOriginal / qtdParcelas;
    const detalheParcelamento = qtdParcelas > 1
      ? `<div style="font-size:0.82rem;font-weight:600;color:var(--text-main);">${qtdParcelas}x de ${formatarMoeda(valorPorParcela)}</div>`
      : '';

    return `
      <div class="conta-card">
        <div class="conta-header">
          <div>
            <h3>${clienteInfo}</h3>
            ${telefoneInfo}
          </div>
          <span class="status-badge ${statusBadgeClass}">${statusText}</span>
        </div>

        ${idPedidoInfo}
        ${descricaoInfo}
        ${detalheParcelamento}

        <div class="conta-progress-bar" title="${pctPago}% pago">
          <div class="conta-progress-fill" style="width: ${pctPago}%;"></div>
        </div>

        <div class="conta-summary">
          <span>
            <small>Valor Total:</small>
            <strong>${formatarMoeda(valOriginal)}</strong>
          </span>
          <span>
            <small>Total Pago (${pctPago}%):</small>
            <strong class="valor-pago">${formatarMoeda(totalPago)}</strong>
          </span>
          <span>
            <small>Saldo Restante:</small>
            <strong class="valor-restante">${formatarMoeda(saldoRestante)}</strong>
          </span>
        </div>

        <div class="conta-actions">
          ${!cancelada && saldoRestante > 0 ? `
            <button class="btn btn-sm btn-primary" onclick="abrirModalPagarContaAReceber('${conta.docId}')">
              <i class="fa-solid fa-hand-holding-dollar"></i> Receber
            </button>
          ` : ''}

          ${conta.telefoneCliente ? `
            <button class="btn btn-sm btn-whatsapp" onclick="enviarMensagemWhatsApp('${conta.docId}')" title="Enviar cobrança via WhatsApp">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </button>
          ` : ''}

          <button class="btn btn-sm btn-ghost" onclick="abrirModalEditarContaAReceber('${conta.docId}')">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="confirmarExclusaoContaAReceber('${conta.docId}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function abrirModalCriarContaManual() {
  document.getElementById("conta-a-receber-modal-titulo").innerHTML = '<i class="fa-solid fa-plus"></i> Nova Conta a Receber';
  document.getElementById("conta-a-receber-doc-id").value = "";
  document.getElementById("conta-a-receber-cliente").value = "";
  document.getElementById("conta-a-receber-telefone").value = "";
  document.getElementById("conta-a-receber-valor").value = "";
  document.getElementById("conta-a-receber-valor-pago").value = "0.00";

  const elParcelas = document.getElementById("conta-a-receber-parcelas");
  if (elParcelas) elParcelas.value = "1";

  document.getElementById("conta-a-receber-descricao").value = "";
  abrirModal("modal-conta-a-receber");
}

function abrirModalEditarContaAReceber(docId) {
  const conta = todasContasAReceber.find(c => c.docId === docId);
  if (!conta) { toast("Conta não encontrada.", "err"); return; }

  document.getElementById("conta-a-receber-modal-titulo").innerHTML = '<i class="fa-solid fa-pencil"></i> Editar Conta a Receber';
  document.getElementById("conta-a-receber-doc-id").value = conta.docId;
  document.getElementById("conta-a-receber-cliente").value = conta.cliente || "";
  document.getElementById("conta-a-receber-telefone").value = conta.telefoneCliente || "";
  document.getElementById("conta-a-receber-valor").value = (conta.valorOriginal || 0).toFixed(2);
  document.getElementById("conta-a-receber-valor-pago").value = (conta.totalPago || 0).toFixed(2);

  const elParcelas = document.getElementById("conta-a-receber-parcelas");
  if (elParcelas) elParcelas.value = conta.qtdParcelas || 1;

  document.getElementById("conta-a-receber-descricao").value = conta.descricao || "";
  abrirModal("modal-conta-a-receber");
}

async function salvarContaAReceber() {
  const docId = document.getElementById("conta-a-receber-doc-id").value;
  const cliente = document.getElementById("conta-a-receber-cliente").value.trim();
  const telefone = document.getElementById("conta-a-receber-telefone").value.trim();
  const valorOriginal = parseFloat(document.getElementById("conta-a-receber-valor").value);
  const valorPago = parseFloat(document.getElementById("conta-a-receber-valor-pago").value) || 0;
  const elParcelas = document.getElementById("conta-a-receber-parcelas");
  const qtdParcelas = elParcelas ? (parseInt(elParcelas.value) || 1) : 1;
  const descricao = document.getElementById("conta-a-receber-descricao").value.trim();

  if (!cliente) { toast("O nome do cliente é obrigatório.", "err"); return; }
  if (isNaN(valorOriginal) || valorOriginal <= 0) { toast("Valor total deve ser maior que zero.", "err"); return; }
  if (isNaN(valorPago) || valorPago < 0) { toast("Valor pago não pode ser negativo.", "err"); return; }
  if (valorPago > valorOriginal) { toast("Valor pago não pode ser maior que o total.", "err"); return; }
  if (qtdParcelas < 1) { toast("Informe ao menos 1 parcela.", "err"); return; }

  const saldoRestante = valorOriginal - valorPago;
  const statusVenda = saldoRestante <= 0 ? "quitada" : "em_aberto";

  const contaData = {
    cliente,
    telefoneCliente: telefone || null,
    descricao: descricao || null,
    valorOriginal,
    totalAReceber: valorOriginal,
    totalPago: valorPago,
    saldoRestante,
    statusVenda,
    qtdParcelas,
    atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    if (docId) {
      await db.collection("contasAReceber").doc(docId).update(contaData);
      toast("Registro atualizado!", "ok");
    } else {
      contaData.criadoEm = firebase.firestore.FieldValue.serverTimestamp();
      contaData.parcelas = [];
      contaData.historicoPagamentos = [];
      await db.collection("contasAReceber").add(contaData);
      toast("Conta adicionada com sucesso!", "ok");
    }
    fecharModal("modal-conta-a-receber");
    await carregarContasAReceber();
    atualizarDashboard();
  } catch (e) {
    toast("Erro ao salvar conta: " + e.message, "err");
  }
}

function abrirModalPagarContaAReceber(docId) {
  const conta = todasContasAReceber.find(c => c.docId === docId);
  if (!conta) { toast("Conta não encontrada.", "err"); return; }

  document.getElementById("pagar-conta-a-receber-doc-id").value = conta.docId;
  document.getElementById("pagar-conta-a-receber-cliente").textContent = conta.cliente || 'Não informado';
  document.getElementById("pagar-conta-a-receber-telefone").textContent = conta.telefoneCliente || 'Não informado';
  document.getElementById("pagar-conta-a-receber-valor-total").textContent = formatarMoeda(conta.totalAReceber || conta.valorOriginal || 0);
  document.getElementById("pagar-conta-a-receber-valor-pendente").textContent = formatarMoeda(conta.saldoRestante);
  document.getElementById("pagar-conta-a-receber-valor-pagar").value = (conta.saldoRestante || 0).toFixed(2);
  abrirModal("modal-registrar-pagamento-conta-a-receber");
}

async function registrarPagamentoContaAReceber() {
  const docId = document.getElementById("pagar-conta-a-receber-doc-id").value;
  const valorPagar = parseFloat(document.getElementById("pagar-conta-a-receber-valor-pagar").value);

  if (isNaN(valorPagar) || valorPagar <= 0) {
    toast("Informe um valor de pagamento válido.", "err");
    return;
  }

  const conta = todasContasAReceber.find(c => c.docId === docId);
  if (!conta) { toast("Conta não encontrada.", "err"); return; }

  if (valorPagar > conta.saldoRestante) {
    toast("O valor a receber não pode ser superior ao saldo pendente.", "err");
    return;
  }

  const novoTotalPago = (conta.totalPago || 0) + valorPagar;
  const novoSaldoRestante = (conta.totalAReceber || conta.valorOriginal) - novoTotalPago;
  const novoStatusVenda = novoSaldoRestante <= 0 ? "quitada" : "em_aberto";

  const historicoEntry = {
    valor: valorPagar,
    data: new Date().toISOString(),
    formaPagamento: "Manual",
    observacao: "Recebimento registrado no painel administrativo"
  };

  try {
    await db.collection("contasAReceber").doc(docId).update({
      totalPago: novoTotalPago,
      saldoRestante: novoSaldoRestante,
      statusVenda: novoStatusVenda,
      historicoPagamentos: firebase.firestore.FieldValue.arrayUnion(historicoEntry),
      atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });

    toast("Pagamento registrado com sucesso!", "ok");
    fecharModal("modal-registrar-pagamento-conta-a-receber");
    await carregarContasAReceber();
    atualizarDashboard();
  } catch (e) {
    toast("Erro ao registrar pagamento: " + e.message, "err");
  }
}

function confirmarExclusaoContaAReceber(docId) {
  document.getElementById("confirm-msg").textContent = "Tem certeza que deseja excluir esta conta a receber? Esta ação não pode ser desfeita.";
  document.getElementById("confirm-ok-btn").onclick = async () => {
    try {
      await db.collection("contasAReceber").doc(docId).delete();
      toast("Conta a receber excluída.", "ok");
      fecharModal("confirm-modal");
      await carregarContasAReceber();
      atualizarDashboard();
    } catch (e) {
      toast("Erro ao excluir conta: " + e.message, "err");
    }
  };
  abrirModal("confirm-modal");
}

// ── CONFIGURAÇÕES ────────────────────────────────────────────────────────────
const CONFIG_PADRAO = {
  nomeLoja: "SAYVO Catalogo",
  whatsapp: "558182362638",
  retiradaDias: [0, 1, 2, 3, 4, 5, 6],
  retiradaHoraInicio: "08:00",
  retiradaHoraFim: "18:00",
  retiradaIntervalo: 60,
  bannerUrl: "",
  bannerTitulo: "Seu próximo carro está aqui.",
  bannerSubtitulo: "Encontre veículos selecionados para você.",
  bannerPosicao: "esquerda",
  corPrimaria: "#aeee02",
  corSecundaria: "#000000",
  corDestaque: "#FFFFFF"
};

async function carregarConfiguracoes() {
  try {
    const doc = await db.collection("configuracoes").doc("geral").get();
    const cfg = doc.exists ? { ...CONFIG_PADRAO, ...doc.data() } : CONFIG_PADRAO;

    document.getElementById("config-nome-loja").value = cfg.nomeLoja || "";
    document.getElementById("config-whatsapp").value = cfg.whatsapp || "";
    document.getElementById("config-endereco").value = cfg.endereco || "";
    document.getElementById("config-latitude").value = cfg.latitude !== null && cfg.latitude !== undefined ? cfg.latitude : "";
    document.getElementById("config-longitude").value = cfg.longitude !== null && cfg.longitude !== undefined ? cfg.longitude : "";
    document.getElementById("config-hora-inicio").value = cfg.retiradaHoraInicio || "08:00";
    document.getElementById("config-hora-fim").value = cfg.retiradaHoraFim || "18:00";
    document.getElementById("config-intervalo").value = cfg.retiradaIntervalo || 60;

    for (let i = 0; i <= 6; i++) {
      const elDia = document.getElementById("config-dia-" + i);
      if (elDia) elDia.checked = Array.isArray(cfg.retiradaDias) && cfg.retiradaDias.includes(i);
    }

    _bannerUrlAtual = cfg.bannerUrl || "";
    document.getElementById("config-banner-titulo").value = cfg.bannerTitulo || "";
    document.getElementById("config-banner-subtitulo").value = cfg.bannerSubtitulo || "";
    document.getElementById("config-banner-posicao").value = cfg.bannerPosicao || "esquerda";

    const previewBanner = document.getElementById("config-banner-preview-atual");
    if (previewBanner) {
      if (cfg.bannerUrl) {
        previewBanner.src = cfg.bannerUrl;
        previewBanner.style.display = "block";
      } else {
        previewBanner.src = "";
        previewBanner.style.display = "none";
      }
    }

    _logoUrlAtual = cfg.logoUrl || "";
    const previewLogo = document.getElementById("config-logo-preview-atual");
    if (previewLogo) {
      if (cfg.logoUrl) {
        previewLogo.src = cfg.logoUrl;
        previewLogo.style.display = "block";
      } else {
        previewLogo.src = "";
        previewLogo.style.display = "none";
      }
    }

    const btnRemoverLogo = document.getElementById("config-btn-remover-logo");
    if (btnRemoverLogo) {
      btnRemoverLogo.style.display = cfg.logoUrl ? "inline-flex" : "none";
    }
    const msgSemLogo = document.getElementById("config-logo-sem-logo");
    if (msgSemLogo) {
      msgSemLogo.style.display = cfg.logoUrl ? "none" : "block";
    }

    // Atualiza identidade visual da loja na Sidebar do Admin
    atualizarIdentidadeSidebar(cfg.nomeLoja, cfg.logoUrl);

    const elLogoTamanho = document.getElementById("config-logo-tamanho");
    if (elLogoTamanho) elLogoTamanho.value = cfg.logoTamanho || 160;

    document.getElementById("config-cor-primaria").value = cfg.corPrimaria || "#aeee02";
    document.getElementById("config-cor-secundaria").value = cfg.corSecundaria || "#000000";
    document.getElementById("config-cor-destaque").value = cfg.corDestaque || "#FFFFFF";

    resetarUploadBanner();
  } catch (e) {
    toast("Erro ao carregar configurações: " + e.message, "err");
  }
}

function atualizarIdentidadeSidebar(nomeLoja, logoUrl) {
  const sidebarDealerName = document.getElementById("sidebar-dealer-name");
  if (sidebarDealerName) {
    const nome = (nomeLoja && nomeLoja.trim()) ? nomeLoja.trim() : "SAYVO Catálogo";
    sidebarDealerName.textContent = nome;
    sidebarDealerName.title = nome;
  }

  const sidebarLogoImg = document.getElementById("sidebar-dealer-logo-img");
  const sidebarLogoPlaceholder = document.getElementById("sidebar-dealer-logo-placeholder");
  if (sidebarLogoImg) {
    if (logoUrl && logoUrl.trim()) {
      sidebarLogoImg.src = logoUrl;
      sidebarLogoImg.style.display = "block";
    } else {
      sidebarLogoImg.src = "";
      sidebarLogoImg.style.display = "none";
    }
  }
  if (sidebarLogoPlaceholder) {
    if (logoUrl && logoUrl.trim()) {
      sidebarLogoPlaceholder.style.display = "none";
    } else {
      sidebarLogoPlaceholder.style.display = "flex";
    }
  }
}

function removerLogoAtual() {
  _logoUrlAtual = "";
  _logoArquivoSelecionado = null;

  const previewLogo = document.getElementById("config-logo-preview-atual");
  if (previewLogo) {
    previewLogo.src = "";
    previewLogo.style.display = "none";
  }

  const btnRemoverLogo = document.getElementById("config-btn-remover-logo");
  if (btnRemoverLogo) btnRemoverLogo.style.display = "none";

  const msgSemLogo = document.getElementById("config-logo-sem-logo");
  if (msgSemLogo) msgSemLogo.style.display = "block";

  const lPreview = document.getElementById("config-logo-upload-preview");
  const lInput = document.getElementById("config-logo-imagem-file");
  if (lPreview) lPreview.style.display = "none";
  if (lInput) lInput.value = "";

  const nomeLoja = document.getElementById("config-nome-loja")?.value || "";
  atualizarIdentidadeSidebar(nomeLoja, "");

  toast("Logotipo desmarcado. Clique em 'Salvar Configurações' para gravar a remoção.", "info");
}

function cancelarNovoLogoSelecionado() {
  _logoArquivoSelecionado = null;
  const lPreview = document.getElementById("config-logo-upload-preview");
  const lInput = document.getElementById("config-logo-imagem-file");
  if (lPreview) lPreview.style.display = "none";
  if (lInput) lInput.value = "";

  const nomeLoja = document.getElementById("config-nome-loja")?.value || "";
  atualizarIdentidadeSidebar(nomeLoja, _logoUrlAtual);
}

document.getElementById("config-nome-loja")?.addEventListener("input", (e) => {
  const sidebarDealerName = document.getElementById("sidebar-dealer-name");
  if (sidebarDealerName) {
    const val = e.target.value.trim();
    sidebarDealerName.textContent = val || "SAYVO Catálogo";
  }
});

document.getElementById("config-banner-imagem-file")?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  _bannerArquivoSelecionado = file;
  const fn = document.getElementById("config-banner-upload-filename");
  if (fn) fn.textContent = file.name;
  const prev = document.getElementById("config-banner-upload-preview");
  if (prev) prev.style.display = "block";

  const reader = new FileReader();
  reader.onload = (ev) => {
    const prevImg = document.getElementById("config-banner-upload-preview-img");
    if (prevImg) prevImg.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById("config-logo-imagem-file")?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  _logoArquivoSelecionado = file;
  const fn = document.getElementById("config-logo-upload-filename");
  if (fn) fn.textContent = file.name;
  const prev = document.getElementById("config-logo-upload-preview");
  if (prev) prev.style.display = "block";

  const reader = new FileReader();
  reader.onload = (ev) => {
    const prevImg = document.getElementById("config-logo-upload-preview-img");
    if (prevImg) prevImg.src = ev.target.result;
    const nomeLoja = document.getElementById("config-nome-loja")?.value || "";
    atualizarIdentidadeSidebar(nomeLoja, ev.target.result);
  };
  reader.readAsDataURL(file);
});

function resetarUploadBanner() {
  _bannerArquivoSelecionado = null;
  _logoArquivoSelecionado = null;

  const bPreview = document.getElementById("config-banner-upload-preview");
  const bInput = document.getElementById("config-banner-imagem-file");
  if (bPreview) bPreview.style.display = "none";
  if (bInput) bInput.value = "";

  const lPreview = document.getElementById("config-logo-upload-preview");
  const lInput = document.getElementById("config-logo-imagem-file");
  if (lPreview) lPreview.style.display = "none";
  if (lInput) lInput.value = "";
}

async function salvarConfiguracoes() {
  const nomeLoja = document.getElementById("config-nome-loja").value.trim();
  const whatsapp = document.getElementById("config-whatsapp").value.trim().replace(/\D/g, "");
  const endereco = document.getElementById("config-endereco").value.trim();
  const latitudeTexto = document.getElementById("config-latitude").value.trim();
  const longitudeTexto = document.getElementById("config-longitude").value.trim();
  const latitude = latitudeTexto !== "" ? parseFloat(latitudeTexto) : null;
  const longitude = longitudeTexto !== "" ? parseFloat(longitudeTexto) : null;
  const horaInicio = document.getElementById("config-hora-inicio").value;
  const horaFim = document.getElementById("config-hora-fim").value;
  const intervalo = parseInt(document.getElementById("config-intervalo").value, 10) || 60;
  const bannerTitulo = document.getElementById("config-banner-titulo").value.trim();
  const bannerSubtitulo = document.getElementById("config-banner-subtitulo").value.trim();
  const bannerPosicao = document.getElementById("config-banner-posicao").value;

  const retiradaDias = [];
  for (let i = 0; i <= 6; i++) {
    if (document.getElementById("config-dia-" + i)?.checked) {
      retiradaDias.push(i);
    }
  }

  if (latitude !== null && (Number.isNaN(latitude) || latitude < -90 || latitude > 90)) {
    toast("A latitude deve estar entre -90 e 90.", "err");
    return;
  }
  if (longitude !== null && (Number.isNaN(longitude) || longitude < -180 || longitude > 180)) {
    toast("A longitude deve estar entre -180 e 180.", "err");
    return;
  }

  const corPrimaria = document.getElementById("config-cor-primaria").value;
  const corSecundaria = document.getElementById("config-cor-secundaria").value;
  const corDestaque = document.getElementById("config-cor-destaque").value;

  if (!nomeLoja || !whatsapp) {
    toast("Preencha nome da loja e WhatsApp.", "err");
    return;
  }

  let bannerUrl = _bannerUrlAtual || "";
  if (_bannerArquivoSelecionado) {
    try {
      bannerUrl = await fazerUploadImagem(_bannerArquivoSelecionado, 1600);
    } catch (e) {
      toast("Erro ao processar o banner: " + e.message, "err");
      return;
    }
  }

  let logoUrl = _logoUrlAtual || "";
  if (_logoArquivoSelecionado) {
    try {
      logoUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(_logoArquivoSelecionado);
      });
    } catch (e) {
      toast("Erro ao processar o logo: " + e.message, "err");
      return;
    }
  }

  const logoTamanho = parseInt(document.getElementById("config-logo-tamanho")?.value, 10) || 160;

  try {
    await db.collection("configuracoes").doc("geral").set({
      nomeLoja,
      whatsapp,
      endereco,
      latitude,
      longitude,
      retiradaDias,
      retiradaHoraInicio: horaInicio,
      retiradaHoraFim: horaFim,
      retiradaIntervalo: intervalo,
      bannerUrl,
      bannerTitulo,
      bannerSubtitulo,
      bannerPosicao,
      logoUrl,
      logoTamanho,
      corPrimaria,
      corSecundaria,
      corDestaque
    });

    _bannerUrlAtual = bannerUrl;
    _logoUrlAtual = logoUrl;
    toast("Configurações salvas com sucesso!", "ok");
    await carregarConfiguracoes();
  } catch (e) {
    toast("Erro: " + e.message, "err");
  }
}

// ── AUXILIARES DE MODAL E TOAST ──────────────────────────────────────────────
function abrirModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("show");
}

function fecharModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("show");
}

document.querySelectorAll(".modal-overlay").forEach(o => {
  o.addEventListener("click", e => { if (e.target === o) fecharModal(o.id); });
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") document.querySelectorAll(".modal-overlay.show").forEach(o => fecharModal(o.id));
});

let _toastTimer;
function toast(msg, tipo = "ok") {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = tipo === "ok" ? "✔ " + msg : "✘ " + msg;
  el.className = "show " + tipo;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.className = "", 3400);
}

// Event Listeners adicionais
document.addEventListener("DOMContentLoaded", () => {
  const inputBusca = document.getElementById("contas-a-receber-search");
  const btnAddConta = document.getElementById("add-conta-manual-btn");

  if (inputBusca) inputBusca.addEventListener("input", renderizarContasAReceber);
  if (btnAddConta) btnAddConta.addEventListener("click", abrirModalCriarContaManual);
});
