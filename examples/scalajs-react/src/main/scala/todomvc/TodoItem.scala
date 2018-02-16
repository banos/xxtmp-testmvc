package tobuymvc

import japgolly.scalajs.react._
import japgolly.scalajs.react.extra.{Px, Reusability}
import japgolly.scalajs.react.vdom.prefix_<^._
import org.scalajs.dom
import org.scalajs.dom.ext.KeyCode

object TodoItem {

  case class Props (
    onToggle:        Callback,
    onDelete:        Callback,
    onStartEditing:  Callback,
    onUpdateTitle:   Title => Callback,
    onCancelEditing: Callback,
    tobuy:            Todo,
    isEditing:       Boolean
  )

  implicit val reusableProps: Reusability[Props] =
    Reusability.fn[Props]((p1, p2) =>
      (p1.tobuy eq p2.tobuy) && (p1.isEditing == p2.isEditing)
    )

  case class State(editText: UnfinishedTitle)

  class Backend($: BackendScope[Props, State]) {
    val inputRef: RefSimple[dom.html.Input] =
      Ref.apply[dom.html.Input]("input")

    case class Callbacks(P: Props) {
      val editFieldSubmit: Callback =
        $.state.flatMap(_.editText.validated.fold(P.onDelete)(P.onUpdateTitle))

      val resetText: Callback =
        $.modState(_.copy(editText = P.tobuy.title.editable))

      val editFieldKeyDown: ReactKeyboardEvent => Option[Callback] =
        e => e.nativeEvent.keyCode match {
          case KeyCode.Escape => Some(resetText >> P.onCancelEditing)
          case KeyCode.Enter  => Some(editFieldSubmit)
          case _              => None
        }
    }

    val cbs: Px[Callbacks] =
      Px.cbA($.props).map(Callbacks)

    val editFieldChanged: ReactEventI => Callback =
      e => {
        /* need to capture event data because React reuses events */
        val captured = e.target.value
        $.modState(_.copy(editText = UnfinishedTitle(captured)))
      }

    def render(P: Props, S: State): ReactElement = {
      val cb = cbs.value()
      <.li(
        ^.classSet(
          "completed" -> P.tobuy.isCompleted,
          "editing"   -> P.isEditing
        ),
        <.div(
          ^.className := "view",
          <.input(
            ^.className := "toggle",
            ^.`type`    := "checkbox",
            ^.checked   := P.tobuy.isCompleted,
            ^.onChange --> P.onToggle
          ),
          <.label(
            P.tobuy.title.value,
            ^.onDoubleClick --> P.onStartEditing
          ),
          <.button(
            ^.className := "destroy",
            ^.onClick --> P.onDelete
          )
        ),
        <.input(
          ^.ref         := inputRef,
          ^.className   := "edit",
          ^.onBlur     --> cb.editFieldSubmit,
          ^.onChange   ==> editFieldChanged,
          ^.onKeyDown ==>? cb.editFieldKeyDown,
          ^.value       := S.editText.value
        )
      )
    }
  }

  private val component =
    ReactComponentB[Props]("TodoItem")
      .initialState_P(p => State(p.tobuy.title.editable))
      .renderBackend[Backend]
      .componentDidUpdate {
        case ComponentDidUpdate(c, prevProps, _) ⇒
          c.backend.inputRef(c)
            .tryFocus
            .when(c.props.isEditing && !prevProps.isEditing)
            .void
      }
      .build

  def apply(P: Props): ReactElement =
    component.withKey(P.tobuy.id.id.toString)(P)
}
