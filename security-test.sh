OMAIN=${1:-"localhost"}
URL="https://$DOMAIN"

echo "================================"
echo "🔒 Teste de Segurança - $DOMAIN"
echo "================================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_header() {
    local header=$1
    local expected=$2
    local result=$(curl -s -I "$URL" | grep -i "^$header:" | cut -d' ' -f2-)
    
    if [ -z "$result" ]; then
        echo -e "${RED}✗${NC} $header: FALTANDO"
        return 1
    elif [ -n "$expected" ] && [[ ! "$result" =~ $expected ]]; then
        echo -e "${YELLOW}⚠${NC} $header: $result (esperado: $expected)"
        return 1
    else
        echo -e "${GREEN}✓${NC} $header: OK"
        return 0
    fi
}

# Testes de Header
echo "📋 HEADERS DE SEGURANÇA:"
echo "========================"
check_header "Strict-Transport-Security" "max-age"
check_header "X-Frame-Options" "DENY"
check_header "X-Content-Type-Options" "nosniff"
check_header "X-XSS-Protection" "1"
check_header "Content-Security-Policy" "default-src"
check_header "Referrer-Policy" "strict-origin"
check_header "Permissions-Policy" ""

echo ""
echo "🔐 PROTOCOLO HTTPS:"
echo "==================="
if curl -s -I "$URL" 2>&1 | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓${NC} HTTPS Ativado"
else
    echo -e "${RED}✗${NC} HTTPS Não Respondendo"
fi

echo ""
echo "📊 INFORMAÇÕES DO SERVIDOR:"
echo "============================"
echo "HTTP Version:"
curl -s -I "$URL" | head -1

echo ""
echo "🔍 HEADERS EXPOSTOS:"
echo "===================="
curl -s -I "$URL" | grep -E "^(Server|X-Powered-By|X-AspNet|X-Framework):" || echo "Nenhum header suspeito exposto ✓"

echo ""
echo "🚨 TESTE DE SEGURANÇA AVANÇADA:"
echo "==============================="

echo -n "Content-Security-Policy: "
csp=$(curl -s -I "$URL" | grep -i "content-security-policy" | cut -d' ' -f2-)
if [ -z "$csp" ]; then
    echo -e "${RED}FALTANDO${NC}"
else
    if echo "$csp" | grep -q "default-src 'self'"; then
        echo -e "${GREEN}FORTE${NC}"
    else
        echo -e "${YELLOW}MODERADA${NC}"
    fi
fi

echo -n "HSTS (Strict-Transport-Security): "
hsts=$(curl -s -I "$URL" | grep -i "strict-transport-security" | cut -d' ' -f2-)
if [ -z "$hsts" ]; then
    echo -e "${YELLOW}NÃO CONFIGURADO${NC}"
else
    if echo "$hsts" | grep -q "max-age=31536000"; then
        echo -e "${GREEN}CONFIGURADO (1 ano)${NC}"
    else
        echo -e "${YELLOW}CONFIGURADO (menos de 1 ano)${NC}"
    fi
fi

echo -n "Permissions-Policy: "
pp=$(curl -s -I "$URL" | grep -i "permissions-policy" | cut -d' ' -f2-)
if [ -z "$pp" ]; then
    echo -e "${YELLOW}NÃO CONFIGURADO${NC}"
else
    echo -e "${GREEN}CONFIGURADO${NC}"
fi

echo ""
echo "RECOMENDAÇÕES:"
echo "================="
echo "1. Teste em https://observatory.mozilla.org/"
echo "2. Teste SSL em https://www.ssllabs.com/ssltest/"
echo "3. Verifique headers em https://securityheaders.com/"
echo "4. Valide CSP em https://csp-evaluator.withgoogle.com/"

echo ""
echo "Teste concluído!"
