# Configuração da API - PSIT Controle de Estoque

## 📡 Configuração Atual

**Servidor API**: `http://localhost:5136`

## 🔧 Como Funciona

### Autenticação

- **Endpoint**: `/api/auth/login` ✅
- **Método**: POST
- **Headers**: Content-Type: application/json
- **Timeout**: Removido (sem timeout)

### Estrutura da Requisição de Login (UsuarioLoginDto)

```json
{
  "Email": "usuario@email.com",
  "Senha": "senha123"
}
```

### Resposta da API

```json
{
  "token": "jwt_token_aqui"
}
```

**Nota**: A API retorna apenas o token. Os dados do usuário são criados localmente no app.

## 🚀 Status da API

1. **Login**: ✅ Configurado e pronto para teste
2. **Produtos**: Atualmente usando AsyncStorage local
3. **Health Check**: `/health` para testar conexão

## 📋 Para Migrar Produtos para API

No arquivo `src/services/productService.ts`:

1. Descomente as funções com sufixo `API`
2. Comente as funções atuais que usam AsyncStorage
3. Substitua os nomes das funções no `productService`

## 🔍 Logs de Debug

- ✅ Conexão estabelecida: logs no console
- ❌ Erro de conexão: logs de erro detalhados
- 📝 Headers automáticos: Authorization Bearer token

## ⚙️ Configurações em `src/config/apiConfig.ts`

- `BASE_URL`: URL do servidor
- `ENDPOINTS`: Todos os endpoints organizados
- `DEV.ENABLE_LOGS`: Ativa/desativa logs de debug
