import styles from './card-info.module.scss';



import ChildComponent from '@/core/component/child.component.js';
import renderService from '@/core/services/render.service.js';



import template from './card-info.template.html';

export class CardInfo extends ChildComponent {
	render(){
		this.element = renderService.htmlToElement(template, [], styles)

		return this.element
	}
}


