export default class Sortable {
  onStartDrag(event) {
    const { target } = event;
    if (!target.classList.contains('list-cards-card')) return;
    event.preventDefault();
    this.draggedEl = target;
    this.ghostEl = this.draggedEl.cloneNode(true);
    this.initialList = this.draggedEl.closest('.list-cards');

    this.draggedEl.style.opacity = '0';
    const cardCansel = this.ghostEl.querySelector('.list-cards-card-remove');
    cardCansel.classList.add('hidden');

    this.ghostEl.classList.add('dragged');
    document.body.appendChild(this.ghostEl);

    const { x, y } = target.getBoundingClientRect();
    this.draggedX = event.pageX - x;
    this.draggedY = event.pageY - y;

    this.ghostEl.style.left = `${event.pageX - this.draggedX}px`;
    this.ghostEl.style.top = `${event.pageY - this.draggedY}px`;

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.onFinishDrag);
  }

  onDrag(event) {
    if (!this.draggedEl) return;
    this.ghostEl.style.left = `${event.pageX - this.draggedX}px`;
    this.ghostEl.style.top = `${event.pageY - this.draggedY}px`;
  }

  onFinishDrag(event) {
    if (!this.draggedEl) return;

    const closest = document.elementFromPoint(event.clientX, event.clientY);
    let list = closest.closest('.list-cards');
    const wrapper = closest.closest('.list-wrapper');
    if (!wrapper) {
      this.returnToInitialPlace();
      this.onStopDrag();
      return;
    }

    if (!list) {
      list = wrapper.querySelector('.list-cards');
      list.appendChild(this.ghostEl);
    } else {
      const closestNext = closest.nextSibling;
      list.insertBefore(this.ghostEl, closestNext);
    }

    this.ghostEl.classList.remove('dragged');
    this.initialList.removeChild(this.draggedEl);

    this.onStopDrag();
  }

  onStopDrag() {
    this.draggedEl = null;
  }

  returnToInitialPlace() {
    this.initialList.insertBefore(this.ghostEl, this.draggedEl);
    this.ghostEl.classList.remove('dragged');
    this.initialList.removeChild(this.draggedEl);
  }
}
