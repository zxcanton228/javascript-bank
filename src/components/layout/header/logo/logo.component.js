import styles from './logo.module.scss';



import ChildComponent from '@/core/component/child.component.js';
import renderService from '@/core/services/render.service.js';



import template from './logo.template.html';

export class Logo extends ChildComponent {
	render(){
		this.element = renderService.htmlToElement(template, [], styles)

		return this.element
	}
}


