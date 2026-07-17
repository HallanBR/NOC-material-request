# Pendências conhecidas

## Regras que precisam de confirmação operacional

1. **Relação entre curva e CTO:** o sistema trata curvas e CTOs como grupos exclusivos dentro do total de postes, calculando o restante como postes retos. Drops de cliente são validados como subconjunto do total, sem duplicar a ferragem. Caso um mesmo poste possa pertencer aos dois grupos na operação, a regra deverá ser revista.
2. **Estoque e aprovação:** não há fonte de saldo, aprovação, destinatários ou e-mail de expedição para integração automática. O sistema gera o texto e o TXT, mas não envia o e-mail.
