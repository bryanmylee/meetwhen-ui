export default function paginatedCard(node) {
	return ({
		update({ card }) {
			if (card) {
				node.style.height = card.offsetHeight + 'px';
			}
		},
	});
}