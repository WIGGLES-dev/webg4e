#[derive(Clone, Copy, PartialEq)]
enum ChangeState {
    Added,
    Removed,
    Changed,
    NoChange,
}

pub struct ChangeSet<T: PartialEq>(Vec<(ChangeState, (Option<T>, Option<T>))>);

impl<T: PartialEq> Default for ChangeSet<T> {
    fn default() -> Self {
        Self(vec![])
    }
}

impl<T: PartialEq> ChangeSet<T> {
    pub fn iter_added(&mut self) -> impl Iterator<Item = &T> {
        self.0.iter_mut().filter_map(|(state, (_, v))| {
            if ChangeState::Added == *state {
                *state = ChangeState::NoChange;
                Some(v.as_ref().unwrap())
            } else {
                None
            }
        })
    }
    pub fn iter_removed(&mut self) -> impl Iterator<Item = T> + '_ {
        self.0
            .drain_filter(|(state, _)| *state == ChangeState::Removed)
            .filter_map(|(state, (_, v))| {
                if ChangeState::Removed == state {
                    Some(v.unwrap())
                } else {
                    None
                }
            })
    }
    pub fn iter_changed(&mut self) -> impl Iterator<Item = (T, &T)> {
        self.0.iter_mut().filter_map(|(state, (old, v))| {
            if ChangeState::Changed == *state {
                *state = ChangeState::NoChange;
                Some((old.take().unwrap(), v.as_ref().unwrap()))
            } else {
                None
            }
        })
    }
    pub fn iter(&self) -> impl Iterator<Item = &T> {
        self.0.iter().map(|(_, (_, v))| v.as_ref().unwrap())
    }
    pub fn set(&mut self, value: T) {
        if let Some((state, (old, v))) = self
            .0
            .iter_mut()
            .find(|(_, (_, v))| v.as_ref().map_or(false, |v| *v == value))
        {
            *state = ChangeState::Changed;
            *old = v.take();
            *v = Some(value);
        } else {
            self.0.push((ChangeState::Added, (None, Some(value))));
        }
    }
    pub fn remove(&mut self, value: T) {
        if let Some((state, (old, v))) = self
            .0
            .iter_mut()
            .find(|(_, (_, v))| v.as_ref().map_or(false, |v| *v == value))
        {
            *state = ChangeState::Removed;
        }
    }
}
