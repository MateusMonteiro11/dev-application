export const dishes = [
  { id: 'burger', name: 'Burger da casa', description: 'Pão macio, hambúrguer bovino, queijo, alface e tomate.', price: 3290, image: '/images/burger.jpg' },
  { id: 'pizza', name: 'Pizza margherita', description: 'Molho de tomate, muçarela e folhas de manjericão fresco.', price: 4590, image: '/images/pizza.jpg' },
  { id: 'massa', name: 'Massa ao pesto', description: 'Massa com pesto de manjericão, tomate e parmesão.', price: 3890, image: '/images/massa.jpg' },
  { id: 'bowl', name: 'Bowl de vegetais', description: 'Folhas, grãos e vegetais coloridos com molho da casa.', price: 2990, image: '/images/bowl.jpg' },
  { id: 'salmao', name: 'Salmão grelhado', description: 'Filé de salmão grelhado com vegetais e um toque de limão.', price: 5990, image: '/images/salmao.jpg' },
]

export const money = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)

export function orderData(user, dish, quantity) {
  if (!user?.uid || !user.displayName?.trim()) throw new Error('Complete seu nome antes de pedir.')
  if (!dishes.some((item) => item.id === dish?.id && item.price === dish.price && item.name === dish.name)) throw new Error('Prato inválido.')
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) throw new Error('Escolha entre 1 e 20 unidades.')
  return {
    uid: user.uid,
    nomeCliente: user.displayName.trim(),
    pratoId: dish.id,
    prato: dish.name,
    quantidade: quantity,
    precoUnitarioCentavos: dish.price,
    valorTotalCentavos: dish.price * quantity,
  }
}
